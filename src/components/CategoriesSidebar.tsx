import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, ArrowLeft, Folder, Tag, ChevronsRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const CategoriesSidebar = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'children'
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/categories-tags/`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Reset view when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main');
      setSelectedParent(null);
    }
  }, [isOpen]);

  const handleParentClick = (category) => {
    if (category.children && category.children.length > 0) {
      setSelectedParent(category);
      setCurrentView('children');
    } else {
      // Navigate to category brands page
      navigate(`/category/${category.slug}/brands`);
      onClose();
    }
  };

  const handleChildClick = (child) => {
    // Navigate to child category brands page
    navigate(`/category/${child.slug}/brands`);
    onClose();
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedParent(null);
  };

  const handleViewAllProducts = () => {
    navigate('/CategoryPage');
    onClose();
  };

  const handleViewParentCategory = () => {
    if (selectedParent) {
      // Navigate to parent category brands page
      navigate(`/category/${selectedParent.slug}/brands`);
      onClose();
    }
  };

  return (
    <>
      {/* Categories Sidebar */}
      <div className={`categories-sidebar fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b bg-brand text-white">
            <div className="flex items-center gap-2">
              {currentView === 'children' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToMain}
                  className="text-white hover:bg-brand/20 p-1 h-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-semibold">
                {currentView === 'main' ? 'Catégories' : selectedParent?.name}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-brand/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Chargement des catégories...</div>
            </div>
          )}

          {/* Main Categories View */}
          {!loading && currentView === 'main' && (
            <div className="flex-1 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucune catégorie disponible
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="border-b border-gray-200 last:border-b-0">
                    <div 
                      className="p-4 hover:bg-gray-50 cursor-pointer group transition-colors duration-150"
                      onClick={() => handleParentClick(category)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">

                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 group-hover:text-brand transition-colors break-words">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              {category.count} produit{category.count !== 1 ? 's' : ''}
                              {category.children && category.children.length > 0 && (
                                <span className="ml-2">• {category.children.length} sous-catégorie{category.children.length !== 1 ? 's' : ''}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {category.children && category.children.length > 0 && (
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand transition-colors flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Children Categories View */}
          {!loading && currentView === 'children' && selectedParent && (
            <div className="flex-1 overflow-y-auto">
              {/* Back to Main Categories Button */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-150"
                  onClick={handleBackToMain}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour aux catégories principales
                </Button>
              </div>

              {/* View All in Parent Category */}
              <div className="border-b border-gray-200 bg-brand/5">
                <div 
                  className="p-4 hover:bg-brand/10 cursor-pointer group transition-colors duration-150"
                  onClick={handleViewParentCategory}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-brand break-words">
                        {selectedParent.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {selectedParent.count} produit{selectedParent.count !== 1 ? 's' : ''} au total
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-brand group-hover:translate-x-1 transition-transform duration-150 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Children List */}
              {selectedParent.children && selectedParent.children.length > 0 ? (
                selectedParent.children.map((child) => (
                  <div key={child.id} className="border-b border-gray-200 last:border-b-0">
                    <div 
                      className="p-4 hover:bg-gray-50 cursor-pointer group transition-colors duration-150"
                      onClick={() => handleChildClick(child)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <Tag className="h-4 w-4 text-brand/70 group-hover:text-brand transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 group-hover:text-brand transition-colors break-words">
                              {child.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              {child.count} produit{child.count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Aucune sous-catégorie disponible
                </div>
              )}
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-gray-50">
            {currentView === 'main' ? (
              <Button 
                className="w-full bg-brand hover:bg-brand/90 transition-colors"
                onClick={handleViewAllProducts}
              >
                Voir tous les Catégories
              </Button>
              
            ) : (
              <div className="space-y-2">
                <Button 
                  className="w-full bg-brand hover:bg-brand/90 transition-colors"
                  onClick={handleViewAllProducts}
                >
                  Voir tous les Catégories
                </Button>
              </div>
            )}

              <Button onClick={()=> navigate('/allbrands')} className='w-full mt-2' variant="outline">
              Voir tous les Marques
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default CategoriesSidebar;