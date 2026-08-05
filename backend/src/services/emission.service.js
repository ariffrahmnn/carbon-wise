import emissionRepository from '../repositories/emission.repository.js';

class EmissionService {
  async getMasterItems() {
    return await emissionRepository.getAllMasterItems();
  }

  async calculateAndSaveEmission(userId, items) {
    if (!items || items.length === 0) {
      throw new Error('Daftar item tidak boleh kosong!');
    }

    // Ambil data faktor emisi dari DB berdasarkan ID yang dikirim FE
    const categoryIds = items.map((i) => i.category_id);
    const categories = await emissionRepository.getCategoriesByIds(categoryIds);

    // Buat Map untuk pencarian cepat
    const categoryMap = new Map(
      categories.map((c) => [c.id, parseFloat(c.emission_factor)])
    );

    let totalCo2 = 0;
    const itemsDetail = [];

    // Hitung emisi tiap item: quantity_value * emission_factor
    for (const item of items) {
      const factor = categoryMap.get(item.category_id);
      if (factor === undefined) {
        throw new Error(`Category ID ${item.category_id} tidak ditemukan!`);
      }

      const calculatedCo2 = item.quantity_value * factor;
      totalCo2 += calculatedCo2;

      itemsDetail.push({
        category_id: item.category_id,
        quantity_value: item.quantity_value,
        calculated_co2_kg: parseFloat(calculatedCo2.toFixed(4)),
      });
    }

    // Simpan ke database via repository
    const savedLog = await emissionRepository.createEmissionLog(
      userId,
      parseFloat(totalCo2.toFixed(4)),
      itemsDetail
    );

    return savedLog;
  }
}

export default new EmissionService();