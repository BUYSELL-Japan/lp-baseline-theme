import { Trash2, Plus } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { useEditMode } from '../../contexts/EditModeContext';

export default function MenuEditor() {
  const { pageData, updateSectionData } = useEditMode();
  const menuData = pageData.menu;

  if (!menuData) return null;

  const categories = Array.isArray(menuData.categories) ? menuData.categories : [];

  const handleItemImageUpload = (categoryIndex: number, itemIndex: number, s3Url: string) => {
    const updatedCategories = [...categories];
    const items = updatedCategories[categoryIndex].items || [];
    items[itemIndex] = {
      ...items[itemIndex],
      image: s3Url,
    };
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      items,
    };
    updateSectionData('menu', {
      ...menuData,
      categories: updatedCategories,
    });
  };

  const handleItemFieldChange = (categoryIndex: number, itemIndex: number, field: string, value: any) => {
    const updatedCategories = [...categories];
    const items = updatedCategories[categoryIndex].items || [];
    items[itemIndex] = {
      ...items[itemIndex],
      [field]: value,
    };
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      items,
    };
    updateSectionData('menu', {
      ...menuData,
      categories: updatedCategories,
    });
  };

  const handleAddItem = (categoryIndex: number) => {
    const updatedCategories = [...categories];
    const items = updatedCategories[categoryIndex].items || [];
    const newItem = {
      name: { ja: '', en: '', ko: '', 'zh-tw': '' },
      description: { ja: '', en: '', ko: '', 'zh-tw': '' },
      price: { ja: '', en: '', ko: '', 'zh-tw': '' },
      image: '',
    };
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      items: [...items, newItem],
    };
    updateSectionData('menu', {
      ...menuData,
      categories: updatedCategories,
    });
  };

  const handleRemoveItem = (categoryIndex: number, itemIndex: number) => {
    const updatedCategories = [...categories];
    const items = updatedCategories[categoryIndex].items || [];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      items: items.filter((_: any, i: number) => i !== itemIndex),
    };
    updateSectionData('menu', {
      ...menuData,
      categories: updatedCategories,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Menu Section</h2>
        <p className="text-sm text-gray-600 mt-1">Manage menu items and products</p>
      </div>

      <div className="space-y-8">
        {categories.map((category: any, categoryIndex: number) => (
          <div key={categoryIndex} className="border border-gray-300 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {typeof category.name === 'object' ? category.name.ja || category.name.en || 'Category' : category.name || 'Category'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {typeof category.name === 'object' ? category.name.en || '' : ''}
                </p>
              </div>
              <button
                onClick={() => handleAddItem(categoryIndex)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-6">
              {(category.items || []).map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-gray-900">Item {itemIndex + 1}</h4>
                    <button
                      onClick={() => handleRemoveItem(categoryIndex, itemIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <ImageUpload
                    label="Item Image"
                    currentImageUrl={item.image}
                    onImageUploaded={(s3Url) => handleItemImageUpload(categoryIndex, itemIndex, s3Url)}
                    aspectRatio="4/3"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name (Japanese)
                      </label>
                      <input
                        type="text"
                        value={typeof item.name === 'object' ? item.name.ja || '' : item.name || ''}
                        onChange={(e) => {
                          const current = typeof item.name === 'object' ? item.name : {};
                          handleItemFieldChange(categoryIndex, itemIndex, 'name', { ...current, ja: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="商品名"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name (English)
                      </label>
                      <input
                        type="text"
                        value={typeof item.name === 'object' ? item.name.en || '' : ''}
                        onChange={(e) => {
                          const current = typeof item.name === 'object' ? item.name : {};
                          handleItemFieldChange(categoryIndex, itemIndex, 'name', { ...current, en: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Item name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (Japanese)
                      </label>
                      <input
                        type="text"
                        value={typeof item.price === 'object' ? item.price.ja || '' : item.price || ''}
                        onChange={(e) => {
                          const current = typeof item.price === 'object' ? item.price : {};
                          handleItemFieldChange(categoryIndex, itemIndex, 'price', { ...current, ja: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="¥1,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (English)
                      </label>
                      <input
                        type="text"
                        value={typeof item.price === 'object' ? item.price.en || '' : ''}
                        onChange={(e) => {
                          const current = typeof item.price === 'object' ? item.price : {};
                          handleItemFieldChange(categoryIndex, itemIndex, 'price', { ...current, en: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$10"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Japanese)
                      </label>
                      <textarea
                        value={typeof item.description === 'object' ? item.description.ja || '' : item.description || ''}
                        onChange={(e) => {
                          const current = typeof item.description === 'object' ? item.description : {};
                          handleItemFieldChange(categoryIndex, itemIndex, 'description', { ...current, ja: e.target.value });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="商品説明"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (English)
                      </label>
                      <textarea
                        value={typeof item.description === 'object' ? item.description.en || '' : ''}
                        onChange={(e) => {
                          const current = typeof item.description === 'object' ? item.description : {};
                          handleItemFieldChange(categoryIndex, itemIndex, 'description', { ...current, en: e.target.value });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Item description"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!category.items || category.items.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items in this category. Click "Add Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No menu categories available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
