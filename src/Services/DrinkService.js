class DrinkService {
  baseUrl = "https://www.thecocktaildb.com/api/json/v1/1";

  async getAllIngredients() {
    const response = await fetch(`${this.baseUrl}/list.php?i=list`);
    const data = await response.json();
    return (data.drinks || []).map((item) => item.strIngredient1);
  }

  async getDrinksByIngredient(ingredient) {
    const response = await fetch(`${this.baseUrl}/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data.drinks || [];
  }

  async getDrinkById(id) {
    const response = await fetch(`${this.baseUrl}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.drinks ? data.drinks[0] : null;
  }

  // 🔽 Alias para compatibilidade com seu código
  async getDrinkDetails(id) {
    return this.getDrinkById(id);
  }
}

export default new DrinkService();