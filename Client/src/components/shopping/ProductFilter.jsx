import { filterOptions } from "../../config/index.js";

const ProductFilter = ({ filters, handleFilters }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-b-gray-200">
                <h2 className="text-lg font-semibold text-black">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {
                    Object.keys(filterOptions).map((filterKey) => (
                        <div key={filterKey}>
                            <h3 className="text-black font-bold">{filterKey}</h3>
                            <div className="grid gap-2 mt-2">
                                {
                                    filterOptions[filterKey].map((option) => (
                                        <label key={option.id} className="flex items-center gap-2 font-medium">
                                            <input
                                                type="checkbox"
                                                value={option.value}
                                                checked={
                                                    !!(filters && Object.keys(filters).length > 0 &&
                                                    filters[filterKey] && filters[filterKey].indexOf(option.id) > -1)
                                                }
                                                onChange={()=>{handleFilters(filterKey, option.id)}}
                                                className="form-checkbox h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                                            />
                                            <span className="text-sm text-black">{option.label}</span>
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ProductFilter;
