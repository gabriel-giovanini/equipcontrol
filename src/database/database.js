import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'equipcontrol.db';
const WEB_STORAGE_KEY = '@equipcontrol_sqlite_web';

let dbInstance = null;
let initPromise = null;

// Fallback para navegadores web caso o WebWorker/WASM do expo-sqlite seja bloqueado
function createWebFallbackDb() {
  const loadRows = () => {
    try {
      const raw = globalThis.localStorage?.getItem(WEB_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveRows = (rows) => {
    try {
      globalThis.localStorage?.setItem(WEB_STORAGE_KEY, JSON.stringify(rows));
    } catch {}
  };

  return {
    async execAsync() {},
    async runAsync(sql, params = []) {
      const normalized = sql.trim().toUpperCase();
      const rows = loadRows();

      if (normalized.startsWith('INSERT')) {
        const [
          nome,
          categoria,
          responsavel,
          status,
          dataCadastro,
          dataEmprestimo,
          dataDevolucao,
        ] = params;
        const nextId =
          rows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
        rows.push({
          id: nextId,
          nome,
          categoria,
          responsavel,
          status,
          dataCadastro,
          dataEmprestimo,
          dataDevolucao,
        });
        saveRows(rows);
        return { lastInsertRowId: nextId, changes: 1 };
      }

      if (normalized.startsWith('UPDATE')) {
        if (params.length === 4) {
          const [status, dataEmprestimo, dataDevolucao, id] = params;
          const idx = rows.findIndex((r) => Number(r.id) === Number(id));
          if (idx === -1) return { changes: 0 };
          rows[idx] = { ...rows[idx], status, dataEmprestimo, dataDevolucao };
          saveRows(rows);
          return { changes: 1 };
        }
        const [
          nome,
          categoria,
          responsavel,
          status,
          dataCadastro,
          dataEmprestimo,
          dataDevolucao,
          id,
        ] = params;
        const idx = rows.findIndex((r) => Number(r.id) === Number(id));
        if (idx === -1) return { changes: 0 };
        rows[idx] = {
          ...rows[idx],
          nome,
          categoria,
          responsavel,
          status,
          dataCadastro,
          dataEmprestimo,
          dataDevolucao,
        };
        saveRows(rows);
        return { changes: 1 };
      }

      if (normalized.startsWith('DELETE')) {
        const [id] = params;
        const filtered = rows.filter((r) => Number(r.id) !== Number(id));
        const changes = rows.length - filtered.length;
        saveRows(filtered);
        return { changes };
      }

      return { changes: 0 };
    },
    async getAllAsync(sql, params = []) {
      const rows = loadRows().sort((a, b) => Number(b.id) - Number(a.id));
      if (sql.toUpperCase().includes('WHERE STATUS = ?')) {
        return rows.filter((r) => r.status === params[0]);
      }
      return rows;
    },
    async getFirstAsync(sql, params = []) {
      const upper = sql.toUpperCase();
      const rows = loadRows();
      if (upper.includes('COUNT(*)')) {
        if (upper.includes('WHERE STATUS = ?')) {
          return { count: rows.filter((r) => r.status === params[0]).length };
        }
        return { count: rows.length };
      }
      if (upper.includes('WHERE ID = ?')) {
        return rows.find((r) => Number(r.id) === Number(params[0])) || null;
      }
      return rows[0] || null;
    },
  };
}

export async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const openSqlite = async () => {
          const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS equipments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT NOT NULL,
              categoria TEXT NOT NULL,
              responsavel TEXT,
              status TEXT NOT NULL,
              dataCadastro TEXT,
              dataEmprestimo TEXT,
              dataDevolucao TEXT
            );
          `);
          return db;
        };

        if (Platform.OS === 'web') {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Web SQLite timeout')), 2000)
          );
          try {
            dbInstance = await Promise.race([openSqlite(), timeoutPromise]);
          } catch {
            dbInstance = createWebFallbackDb();
          }
          return dbInstance;
        }

        dbInstance = await openSqlite();
        return dbInstance;
      } catch (error) {
        initPromise = null;
        console.error('Erro ao inicializar banco:', error);
        throw new Error('Não foi possível abrir o banco de dados.');
      }
    })();
  }

  return initPromise;
}

export async function initDatabase() {
  return await getDatabase();
}

export async function insertEquipment({
  nome,
  categoria,
  responsavel,
  status = 'Disponível',
  dataCadastro,
  dataEmprestimo = null,
  dataDevolucao = null,
}) {
  if (!nome || !nome.trim()) {
    throw new Error('O nome do equipamento é obrigatório.');
  }

  try {
    const db = await getDatabase();
    const cleanNome = nome.trim();
    const cleanCategoria = (categoria || 'Outros').trim();
    const cleanResponsavel = (responsavel || 'Não atribuído').trim();
    const cleanStatus = status || 'Disponível';

    const result = await db.runAsync(
      `INSERT INTO equipments (nome, categoria, responsavel, status, dataCadastro, dataEmprestimo, dataDevolucao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanNome,
        cleanCategoria,
        cleanResponsavel,
        cleanStatus,
        dataCadastro,
        dataEmprestimo,
        dataDevolucao,
      ]
    );

    return {
      id: result.lastInsertRowId,
      nome: cleanNome,
      categoria: cleanCategoria,
      responsavel: cleanResponsavel,
      status: cleanStatus,
      dataCadastro,
      dataEmprestimo,
      dataDevolucao,
    };
  } catch (error) {
    console.error('Erro ao inserir equipamento:', error);
    throw new Error('Erro ao cadastrar o equipamento.');
  }
}

export async function getAllEquipments() {
  try {
    const db = await getDatabase();
    return await db.getAllAsync('SELECT * FROM equipments ORDER BY id DESC');
  } catch (error) {
    console.error('Erro ao listar equipamentos:', error);
    throw new Error('Não foi possível carregar os equipamentos.');
  }
}

export async function getEquipmentsByStatus(status) {
  try {
    const db = await getDatabase();
    return await db.getAllAsync(
      'SELECT * FROM equipments WHERE status = ? ORDER BY id DESC',
      [status]
    );
  } catch (error) {
    console.error('Erro ao filtrar equipamentos:', error);
    throw new Error('Não foi possível filtrar os equipamentos.');
  }
}

export async function getEquipmentById(id) {
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    throw new Error('ID inválido.');
  }

  try {
    const db = await getDatabase();
    return await db.getFirstAsync(
      'SELECT * FROM equipments WHERE id = ?',
      [numericId]
    );
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error);
    throw new Error('Não foi possível buscar os dados do equipamento.');
  }
}

export async function getEquipmentCounts() {
  try {
    const db = await getDatabase();
    const totalRow = await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM equipments'
    );
    const emUsoRow = await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM equipments WHERE status = ?',
      ['Em uso']
    );
    const disponiveisRow = await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM equipments WHERE status = ?',
      ['Disponível']
    );

    return {
      total: totalRow?.count ?? 0,
      emUso: emUsoRow?.count ?? 0,
      disponiveis: disponiveisRow?.count ?? 0,
    };
  } catch (error) {
    console.error('Erro ao contar equipamentos:', error);
    throw new Error('Não foi possível atualizar os contadores.');
  }
}

export async function updateEquipment(
  id,
  {
    nome,
    categoria,
    responsavel,
    status,
    dataCadastro,
    dataEmprestimo = null,
    dataDevolucao = null,
  }
) {
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    throw new Error('ID inválido para atualização.');
  }
  if (!nome || !nome.trim()) {
    throw new Error('O nome do equipamento é obrigatório.');
  }

  try {
    const db = await getDatabase();
    const result = await db.runAsync(
      `UPDATE equipments
       SET nome = ?, categoria = ?, responsavel = ?, status = ?, dataCadastro = ?, dataEmprestimo = ?, dataDevolucao = ?
       WHERE id = ?`,
      [
        nome.trim(),
        (categoria || 'Outros').trim(),
        (responsavel || 'Não atribuído').trim(),
        status,
        dataCadastro,
        dataEmprestimo,
        dataDevolucao,
        numericId,
      ]
    );

    if (result.changes === 0) {
      throw new Error('Equipamento não encontrado.');
    }

    return await getEquipmentById(numericId);
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    throw new Error(error.message || 'Erro ao atualizar o equipamento.');
  }
}

export async function updateEquipmentStatus(
  id,
  status,
  dataEmprestimo = null,
  dataDevolucao = null
) {
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    throw new Error('ID inválido.');
  }

  try {
    const db = await getDatabase();
    const result = await db.runAsync(
      `UPDATE equipments
       SET status = ?, dataEmprestimo = ?, dataDevolucao = ?
       WHERE id = ?`,
      [status, dataEmprestimo, dataDevolucao, numericId]
    );

    if (result.changes === 0) {
      throw new Error('Equipamento não encontrado.');
    }

    return await getEquipmentById(numericId);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw new Error('Não foi possível alterar o status.');
  }
}

export async function deleteEquipment(id) {
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    throw new Error('ID inválido para exclusão.');
  }

  try {
    const db = await getDatabase();
    const result = await db.runAsync(
      'DELETE FROM equipments WHERE id = ?',
      [numericId]
    );

    if (result.changes === 0) {
      throw new Error('Equipamento não encontrado.');
    }

    return result;
  } catch (error) {
    console.error('Erro ao excluir equipamento:', error);
    throw new Error(error.message || 'Não foi possível excluir o equipamento.');
  }
}
