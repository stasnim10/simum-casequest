import React from 'react';

export default function FeedbackPanel(props) {
  // Placeholder UI; replace with real implementation later
  const { title = 'Feedback', children = null } = props;
  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, background: '#fafafa' }}>
      <strong>{title}</strong>
      <div style={{ marginTop: 8, fontSize: 14 }}>
        {children || 'Feedback panel placeholder rendered during deployment.'}
      </div>
    </div>
  );
}
