import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenamento local do seed
const STORAGE_KEY = '@equipcontrol_seed_data';

// Dados estáticos dos equipamentos — Fase 1 e Seed
export const INICIAIS_EQUIPAMENTOS = [
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

const equipments = INICIAIS_EQUIPAMENTOS;

// Funções utilitárias de persistência (AsyncStorage) para Fase 2
export async function salvarEquipamentosStorage(lista) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (error) {
    console.error('Erro ao salvar no AsyncStorage:', error);
  }
}

export async function carregarEquipamentosStorage() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INICIAIS_EQUIPAMENTOS));
      return INICIAIS_EQUIPAMENTOS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler do AsyncStorage:', error);
    return INICIAIS_EQUIPAMENTOS;
  }
}

export async function adicionarEquipamentoStorage(equip) {
  try {
    const lista = await carregarEquipamentosStorage();
    const novaLista = [...lista, equip];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
    return novaLista;
  } catch (error) {
    console.error('Erro ao adicionar no AsyncStorage:', error);
    return [];
  }
}

export default equipments;
