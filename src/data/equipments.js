// Dados estáticos dos equipamentos — Fase 1
// Em fases futuras, esses dados virão de um banco de dados (SQLite)

const equipments = [
  {
    id: '1',
    nome: 'Notebook Dell Latitude',
    responsavel: 'Gabriel Giovanini',
    status: 'Emprestado',
    dataCadastro: '15/08/2026',
    dataEmprestimo: '18/08/2026',
    dataDevolucao: '25/08/2026',
    categoria: 'Notebook',
  },
  {
    id: '2',
    nome: 'Projetor Epson',
    responsavel: 'Sala de Reuniões',
    status: 'Disponível',
    dataCadastro: '10/08/2026',
    dataEmprestimo: null,
    dataDevolucao: null,
    categoria: 'Projetor',
  },
  {
    id: '3',
    nome: 'iPad Apple',
    responsavel: 'João Silva',
    status: 'Emprestado',
    dataCadastro: '12/08/2026',
    dataEmprestimo: '20/08/2026',
    dataDevolucao: '30/08/2026',
    categoria: 'Tablet',
  },
  {
    id: '4',
    nome: 'Monitor LG UltraWide',
    responsavel: 'Laboratório 3',
    status: 'Disponível',
    dataCadastro: '08/08/2026',
    dataEmprestimo: null,
    dataDevolucao: null,
    categoria: 'Monitor',
  },
  {
    id: '5',
    nome: 'Câmera Canon EOS',
    responsavel: 'Maria Souza',
    status: 'Emprestado',
    dataCadastro: '14/08/2026',
    dataEmprestimo: '22/08/2026',
    dataDevolucao: '01/09/2026',
    categoria: 'Câmera',
  },
];

export default equipments;
