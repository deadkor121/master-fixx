import { useQuery } from "@tanstack/react-query";
import { type ServiceCategory } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: number) => void;
}

const categoryIcons: Record<string, string> = {
  "Сантехніка": "🔧",
  "Електрика": "⚡",
  "Прибирання": "🧹",
  "Ремонт": "🎨",
  "Побутова техніка": "⚙️",
  "Меблі": "🛋️",
};

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  "blue": { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-600" },
  "yellow": { bg: "bg-yellow-50", text: "text-yellow-600", icon: "bg-yellow-600" },
  "green": { bg: "bg-green-50", text: "text-green-600", icon: "bg-green-600" },
  "purple": { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-600" },
  "red": { bg: "bg-red-50", text: "text-red-600", icon: "bg-red-600" },
  "indigo": { bg: "bg-indigo-50", text: "text-indigo-600", icon: "bg-indigo-600" },
};

export function ServiceCategories({ onCategorySelect }: ServiceCategoriesProps) {
  const { data: categories, isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Популярні послуги</h2>
            <p className="text-xl text-gray-600">Оберіть категорію послуг, які вам потрібні</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="p-8">
                <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto mb-4" />
                <Skeleton className="h-5 w-20 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Популярні послуги</h2>
          <p className="text-xl text-gray-600">Оберіть категорію послуг, які вам потрібні</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories?.map((category) => {
            const colors = categoryColors[category.color] || categoryColors.blue;
            return (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
                onClick={() => onCategorySelect(category.id)}
              >
                <div className={`${colors.bg} rounded-2xl p-8 text-center transition-all duration-300`}>
                  <div className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl`}>
                    {categoryIcons[category.name] || "🏠"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <span className={`inline-block mt-4 ${colors.text} font-medium group-hover:opacity-80 transition-opacity`}>
                    від {category.basePrice} грн
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
