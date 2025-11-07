import hashlib
import json
import runpy
import sys
import types
from pathlib import Path


def test_precompute_script_creates_outputs(monkeypatch, tmp_path):
    """
    Run scripts/precompute-embeddings-local.py with a fake sentence_transformers
    module so the test doesn't download models. Verify embeddings JSON and version
    JSON are written and that the version checksum matches payload.
    """

    class FakeSentenceTransformer:
        def __init__(self, model_name, **kwargs):
            self.model_name = model_name

        def encode(self, texts, normalize_embeddings=True, show_progress_bar=True):
            vectors = []
            for idx, _ in enumerate(texts):
                vectors.append([float(idx) + 0.1, float(idx) + 0.2, float(idx) + 0.3])
            return vectors

    fake_module = types.SimpleNamespace(SentenceTransformer=FakeSentenceTransformer)
    monkeypatch.setitem(sys.modules, "sentence_transformers", fake_module)

    items = [
        {"id": "item-1", "text": "First sample text", "meta": {"module": "A"}},
        {"id": "item-2", "text": "Second sample text", "meta": {"module": "B"}},
    ]
    input_file = tmp_path / "lessons.json"
    input_file.write_text(json.dumps(items, ensure_ascii=False), encoding="utf-8")

    out_dir = tmp_path / "public" / "data"
    out_file = out_dir / "embeddings.json"
    version_file = out_dir / "embeddings.version.json"

    script_path = Path("scripts") / "precompute-embeddings-local.py"
    monkeypatch.setattr(
        sys,
        "argv",
        [
            str(script_path),
            "--input",
            str(input_file),
            "--output",
            str(out_file),
        ],
    )

    runpy.run_path(str(script_path), run_name="__main__")

    assert out_file.exists(), f"Expected embeddings output at {out_file}"
    assert version_file.exists(), f"Expected version metadata at {version_file}"

    payload = json.loads(out_file.read_text(encoding="utf-8"))
    assert isinstance(payload, list)
    assert len(payload) == 2
    assert payload[0]["id"] == "item-1"
    assert "embedding" in payload[0]

    version_payload = json.loads(version_file.read_text(encoding="utf-8"))
    expected_checksum = hashlib.sha256(
        json.dumps(payload, ensure_ascii=False).encode("utf-8")
    ).hexdigest()
    assert version_payload.get("version") == expected_checksum
