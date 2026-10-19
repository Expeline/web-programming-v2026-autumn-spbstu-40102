import {useState, useEffect} from 'react';
import TreeNode from './components/TreeNode';
import './styles.css';

const STORAGE_KEY = 'bookstore_tree';
const STORAGE_EXPANDED = 'bookstore_expanded';

let nextId = 1;

function generateId(prefix) {
  return `${prefix}-${nextId++}`;
}

const defaultData = [
  {
    id: 'a-1',
    name: 'Фёдор Достоевский',
    type: 'author',
    children: [
      {
        id: 'p-1',
        name: 'Эксмо',
        type: 'publisher',
        children: [
          {
            id: 'g-1',
            name: 'Классика',
            type: 'genre',
            children: [
              {id: 'b-1', name: 'Преступление и наказание', type: 'book'},
            ],
          },
        ],
      },
    ],
  },
];

function App() {
  const [treeData, setTreeData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem(STORAGE_EXPANDED);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
    // Раскрываем все узлы по умолчанию
    const allIds = new Set();
    const collectIds = (nodes) => {
      nodes.forEach((node) => {
        allIds.add(node.id);
        if (node.children) {
          collectIds(node.children);
        }
      });
    };
    collectIds(defaultData);
    return allIds;
  });

  const [formData, setFormData] = useState({
    author: '',
    publisher: '',
    genre: '',
    title: '',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(treeData));
  }, [treeData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_EXPANDED, JSON.stringify([...expanded]));
  }, [expanded]);

  const toggleNode = (id) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (
      !formData.author ||
      !formData.publisher ||
      !formData.genre ||
      !formData.title
    ) {
      return;
    }

    const newTree = JSON.parse(JSON.stringify(treeData));

    let authorNode = newTree.find(
      (n) => n.name === formData.author && n.type === 'author',
    );
    if (!authorNode) {
      authorNode = {
        id: generateId('a'),
        name: formData.author,
        type: 'author',
        children: [],
      };
      newTree.push(authorNode);
    }

    let pubNode = authorNode.children.find(
      (n) => n.name === formData.publisher && n.type === 'publisher',
    );
    if (!pubNode) {
      pubNode = {
        id: generateId('p'),
        name: formData.publisher,
        type: 'publisher',
        children: [],
      };
      authorNode.children.push(pubNode);
    }

    let genNode = pubNode.children.find(
      (n) => n.name === formData.genre && n.type === 'genre',
    );
    if (!genNode) {
      genNode = {
        id: generateId('g'),
        name: formData.genre,
        type: 'genre',
        children: [],
      };
      pubNode.children.push(genNode);
    }

    if (
      !genNode.children.find(
        (n) => n.name === formData.title && n.type === 'book',
      )
    ) {
      genNode.children.push({
        id: generateId('b'),
        name: formData.title,
        type: 'book',
      });
    }

    setTreeData(newTree);
    setFormData({author: '', publisher: '', genre: '', title: ''});
  };

  return (
    <main data-testid="app" className="app-container">
      <h1>Книжный магазин</h1>

      <form
        data-testid="add-book-form"
        className="add-book-form"
        onSubmit={handleAddBook}
      >
        <input
          name="author"
          placeholder="Автор"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          required
        />
        <input
          name="publisher"
          placeholder="Издательство"
          value={formData.publisher}
          onChange={(e) =>
            setFormData({...formData, publisher: e.target.value})
          }
          required
        />
        <input
          name="genre"
          placeholder="Жанр"
          value={formData.genre}
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
          required
        />
        <input
          name="title"
          placeholder="Название книги"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <button type="submit" data-testid="add-book-btn">
          Добавить книгу
        </button>
      </form>

      <ul className="tree-root" data-testid="tree">
        {treeData.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            expanded={expanded}
            onToggle={toggleNode}
          />
        ))}
      </ul>
    </main>
  );
}

export default App;
