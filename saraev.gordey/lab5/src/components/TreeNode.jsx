function TreeNode({node, expanded, onToggle}) {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const getTypeLabel = (type) => {
    switch (type) {
      case 'author':
        return 'Автор';
      case 'publisher':
        return 'Издательство';
      case 'genre':
        return 'Жанр';
      case 'book':
        return 'Книга';
      default:
        return '';
    }
  };

  return (
    <li className="tree-node" data-testid="tree-level" data-level={node.type}>
      <div
        className={`tree-node-content ${hasChildren ? 'clickable' : ''} ${isExpanded ? 'expanded' : ''}`}
        data-testid="tree-toggle"
        onClick={() => hasChildren && onToggle(node.id)}
      >
        <span
          className="tree-icon"
          data-testid={hasChildren ? 'tree-branch' : 'tree-leaf'}
        >
          {hasChildren ? (isExpanded ? '▼' : '▶') : '•'}
        </span>
        <span className="tree-type">{getTypeLabel(node.type)}:</span>
        <span className="tree-name">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <ul className="tree-children" data-testid="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default TreeNode;
