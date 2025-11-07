#!/usr/bin/env python3
"""
Local embedding precompute for CaseQuest.

Reads a JSON file that contains a list of content blocks (id, text, optional meta),
computes sentence embeddings with sentence-transformers/all-MiniLM-L6-v2, and writes:
  - public/data/embeddings.json         (full payload with vectors)
  - public/data/embeddings.version.json (hash + timestamp metadata)

Usage:
  python scripts/precompute-embeddings-local.py \
      --input data/lessons.json \
      --output public/data/embeddings.json

Set HF_API_TOKEN in your environment or pass --hf-token if you want authenticated
downloads; otherwise the model loads anonymously and is cached locally.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import pathlib
import sys
from typing import Any, Dict, List, Optional

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print(
        "Missing dependency: sentence-transformers.\n"
        "Install locally with: pip install sentence-transformers",
        file=sys.stderr,
    )
    sys.exit(1)


def load_items(path: pathlib.Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError(f"{path} must contain a JSON array")
    for item in data:
        if "id" not in item or "text" not in item:
            raise ValueError("Each item must include 'id' and 'text'")
    return data


def compute_embeddings(
    items: List[Dict[str, Any]], model_name: str, hf_token: Optional[str]
) -> List[Dict[str, Any]]:
    kwargs: Dict[str, Any] = {}
    if hf_token:
        kwargs["use_auth_token"] = hf_token
    model = SentenceTransformer(model_name, **kwargs)

    texts = [item["text"] for item in items]
    vectors = model.encode(texts, normalize_embeddings=True, show_progress_bar=True)

    enriched: List[Dict[str, Any]] = []
    for item, vector in zip(items, vectors, strict=True):
        enriched.append(
            {
                "id": item["id"],
                "text": item["text"],
                "meta": item.get("meta") or {},
                "embedding": vector.tolist() if hasattr(vector, "tolist") else list(vector),
            }
        )
    return enriched


def write_embeddings(output_path: pathlib.Path, entries: List[Dict[str, Any]]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(entries, handle, ensure_ascii=False)
    print(f"Wrote {len(entries)} embeddings → {output_path}")


def write_version_file(version_path: pathlib.Path, entries: List[Dict[str, Any]]) -> None:
    payload = json.dumps(entries, ensure_ascii=False).encode("utf-8")
    checksum = hashlib.sha256(payload).hexdigest()
    version_data = {
        "version": checksum,
        "updated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "count": len(entries),
    }
    with version_path.open("w", encoding="utf-8") as handle:
        json.dump(version_data, handle, ensure_ascii=False)
    print(f"Wrote version metadata → {version_path} ({checksum[:12]}…)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Precompute CaseQuest embeddings.")
    parser.add_argument("--input", required=True, help="Path to source JSON content")
    parser.add_argument(
        "--output",
        default="public/data/embeddings.json",
        help="Embeddings output path",
    )
    parser.add_argument(
        "--model",
        default="sentence-transformers/all-MiniLM-L6-v2",
        help="SentenceTransformers model name",
    )
    parser.add_argument(
        "--hf-token",
        default=os.environ.get("HF_API_TOKEN"),
        help="Optional Hugging Face token (env HF_API_TOKEN also respected)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    input_path = pathlib.Path(args.input)
    output_path = pathlib.Path(args.output)
    version_path = output_path.with_suffix(".version.json")

    items = load_items(input_path)
    embeddings = compute_embeddings(items, args.model, args.hf_token)
    write_embeddings(output_path, embeddings)
    write_version_file(version_path, embeddings)
    print("Done.")


if __name__ == "__main__":
    main()
