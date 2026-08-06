import emissionRepository from '../repositories/emission.repository.js';

class EmissionService {
  async getMasterItems() {
    return await emissionRepository.getAllMasterItems();
  }

  async calculateAndSaveEmission(userId, items) {
    if (!items || items.length === 0) {
      throw new Error('Daftar item tidak boleh kosong!');
    }

    const itemIds = items.map((i) => i.item_id);
    const dbItems = await emissionRepository.getItemsByIds(itemIds);

    // Simpan objek item utuh di Map
    const itemMap = new Map(dbItems.map((item) => [item.id, item]));

    let totalCo2 = 0;
    const itemsDetail = [];

    for (const item of items) {
      const dbItem = itemMap.get(item.item_id);
      if (!dbItem) {
        throw new Error(`Item ID ${item.item_id} tidak ditemukan!`);
      }

      const factor = parseFloat(dbItem.co2_factor_per_unit);
      const calculatedCo2 = parseFloat((item.quantity_value * factor).toFixed(4));
      totalCo2 += calculatedCo2;

      itemsDetail.push({
        category_id: dbItem.category_id,
        item_id: item.item_id,
        quantity: item.quantity_value,
        calculated_co2: calculatedCo2,
        // Untuk formatting response FE:
        item_name: dbItem.item_name,
        category_type: dbItem.category_type,
        unit: dbItem.unit
      });
    }

    // 🛑 PERUBAHAN ADA DI DUA BARIS BAWAH INI:
    const totalCo2Final = parseFloat(totalCo2.toFixed(4));
    const result = await emissionRepository.createEmissionLogsBatch(
      userId, 
      totalCo2Final, // 👈 Passing totalCo2 ke Repository
      itemsDetail
    );

    // Format response agar cantik & siap dikonsumsi FE
    return {
      batch_id: result.batch_id,
      user_id: userId,
      total_co2_kg: totalCo2Final,
      details: itemsDetail.map(i => ({
        item_id: i.item_id,
        item_name: i.item_name,
        category_type: i.category_type,
        quantity_value: i.quantity,
        unit: i.unit,
        subtotal_co2_kg: i.calculated_co2
      }))
    };
  }
  async getUserAnalytics(userId, targetMonth, targetYear) {
    return await emissionRepository.getUserAnalytics(userId, targetMonth, targetYear);
  }

  async resetUserEmissions(userId) {
    return await emissionRepository.resetUserEmissionData(userId);
  }
}

export default new EmissionService();