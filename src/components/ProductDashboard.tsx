import {
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
  useMemo,
} from "react";
import {
  Search,
  Database,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
  Sparkles,
  ShoppingCart,
  Warehouse,
  Box,
  Sofa,
  Armchair,
  Lamp,
  BedDouble,
  LayoutGrid,
  X,
  Globe,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  Check,
  SlidersHorizontal,
  Circle,
  Tag,
  LogOut,
} from "lucide-react";

import "./ProductDashboard.css";

const manufacturerData: {
  [key: string]: { name: string; icon: string; color: string; description: string };
} = {
  A: {
    name: "Bernhardt",
    icon: "sofa",
    color: "#8b5cf6",
    description: "Premium furniture",
  },
  B: {
    name: "Ashley",
    icon: "armchair",
    color: "#ec4899",
    description: "Home furnishings",
  },
  C: {
    name: "Coaster",
    icon: "lamp",
    color: "#f59e0b",
    description: "Modern designs",
  },
  D: {
    name: "Luonto",
    icon: "bed",
    color: "#10b981",
    description: "Sleeper sofas",
  },
  E: {
    name: "BH",
    icon: "package",
    color: "#6366f1",
    description: "Quality products",
  },
  F: {
    name: "Shopify Carts",
    icon: "cart",
    color: "#22d3ee",
    description: "Cart analytics",
  },
  G: {
    name: "Massiano",
    icon: "warehouse",
    color: "#f43f5e",
    description: "Inventory data",
  },
  H: {
    name: "Universal",
    icon: "box",
    color: "#a855f7",
    description: "New products",
  },
  I: {
    name: "Fjords",
    icon: "armchair2",
    color: "#0ea5e9",
    description: "Norwegian recliners",
  },
  J: {
    name: "JNM",
    icon: "tag",
    color: "#84cc16",
    description: "Modern furniture",
  },
};

const tableMap: { [key: string]: string } = {
  A: "bernhardt_products_modified",
  B: "ashley_products",
  C: "coaster_products",
  D: "luontostock",
  E: "bh_products",
  F: "shopify_carts",
  G: "massiano_inventory",
  H: "universal_newproducts_modified",
  I: "fjords_products",
  J: "jnm_products",
};

const manufacturerColumns: { [key: string]: { key: string; label: string; sortable?: boolean }[] } = {
  A: [
    { key: "id", label: "ID" },
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "msrp", label: "MSRP" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status", sortable: true },
    { key: "quantity", label: "Qty" },
    { key: "next_availability_date", label: "Next Available" },
    { key: "last_updated", label: "Updated" },
  ],
  B: [
    { key: "product_name", label: "Product Name" },
    { key: "product_sku", label: "SKU" },
    { key: "product_details_int1", label: "Price" },
    { key: "product_status", label: "Status", sortable: true },
    { key: "inventory_availability", label: "Availability", sortable: true },
    { key: "inventory_qtyvalue", label: "Qty" },
    { key: "last_updated", label: "Updated" },
  ],
  C: [
    { key: "product_sku", label: "SKU" },
    { key: "product_status", label: "Status", sortable: true },
    { key: "inventory_qtyvalue", label: "Qty" },
    { key: "last_updated", label: "Updated" },
    { key: "inventory_availability", label: "Available Inventory", sortable: true },
  ],
  D: [
    { key: "id", label: "ID" },
    { key: "productname", label: "Product Name" },
    { key: "productsku", label: "SKU" },
    { key: "availability", label: "Availability", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "next_available_date", label: "Next Available" },
  ],
  E: [
    { key: "id", label: "ID" },
    { key: "vendor_sku", label: "Vendor SKU" },
    { key: "description", label: "Description" },
    { key: "quantity", label: "Qty" },
    { key: "last_updated", label: "Updated" },
  ],
  F: [
    { key: "id", label: "ID" },
    { key: "store_domain", label: "Store" },
    { key: "cart_token", label: "Cart Token" },
    { key: "product_id", label: "Product ID" },
    { key: "sku", label: "SKU" },
    { key: "product_title", label: "Title" },
    { key: "vendor", label: "Vendor" },
    { key: "amount", label: "Amount" },
    { key: "quantity", label: "Qty" },
    { key: "received_at", label: "Received At" },
  ],
  G: [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product Name" },
    { key: "po_number", label: "PO Number" },
    { key: "received_qty", label: "Received Qty" },
    { key: "pending_qty", label: "Pending Qty" },
    { key: "vendor", label: "Vendor" },
    { key: "status", label: "Status", sortable: true },
    { key: "last_updated", label: "Updated" },
  ],
  H: [
    { key: "id", label: "ID" },
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "quantity", label: "Quantity" },
    { key: "retail_price", label: "Retail Price" },
    { key: "your_price", label: "Your Price" },
    { key: "availability_date", label: "Availability Date" },
    { key: "last_updated", label: "Updated" },
  ],
  I: [
    { key: "sku", label: "SKU" },
    { key: "model", label: "Model" },
    { key: "collection", label: "Collection" },
    { key: "item_name", label: "Item Name" },
    { key: "in_stock", label: "In Stock", sortable: true },
    { key: "next_avail", label: "Next Avail Qty" },
    { key: "next_avail_date", label: "Next Avail Date" },
    { key: "next_avail_status", label: "Avail Status", sortable: true },
    { key: "created_time", label: "Created" },
    { key: "updated_time", label: "Updated" },
  ],
  J: [
    { key: "id", label: "ID" },
    { key: "sku", label: "SKU" },
    { key: "manufacturers_sku", label: "Manufacturer SKU" },
    { key: "qty_in_stock", label: "Qty In Stock" },
    { key: "eta_date", label: "ETA Date" },
    { key: "discontinued", label: "Discontinued", sortable: true },
    { key: "last_updated", label: "Updated" },
  ],
};

const PAGE_SIZE = 20;

interface GlobalSearchResult {
  manufacturerKey: string;
  data: any[];
  count: number;
  loading: boolean;
  error: boolean;
}

interface SortConfig {
  column: string;
  priorityValue: string | null;
}

interface ProductDashboardProps {
  onLogout?: () => void;
}

// Extract unique values from data for a specific column
function getUniqueValues(data: any[], column: string): string[] {
  const values = new Set<string>();
  data.forEach(item => {
    const val = item[column];
    if (val !== null && val !== undefined && val !== "") {
      values.add(String(val).trim());
    }
  });
  return Array.from(values).sort();
}

// Get count of items for each status value
function getValueCounts(data: any[], column: string): { [key: string]: number } {
  const counts: { [key: string]: number } = {};
  data.forEach(item => {
    const val = item[column];
    if (val !== null && val !== undefined && val !== "") {
      const key = String(val).trim();
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

// Get all sortable columns for a manufacturer
function getSortableColumns(manufacturerKey: string): { key: string; label: string }[] {
  const columns = manufacturerColumns[manufacturerKey];
  if (!columns) return [];
  return columns.filter(col => col.sortable).map(col => ({ key: col.key, label: col.label }));
}

// Sorting Dropdown Component with multiple column support
interface SortDropdownProps {
  currentSort: SortConfig;
  sortableColumns: { key: string; label: string }[];
  onSortChange: (column: string, priorityValue: string | null) => void;
  accentColor?: string;
  data: any[];
}

function SortDropdown({ 
  currentSort, 
  sortableColumns,
  onSortChange, 
  accentColor, 
  data 
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>(sortableColumns[0]?.key || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const uniqueValues = useMemo(() => getUniqueValues(data, selectedColumn), [data, selectedColumn]);
  const valueCounts = useMemo(() => getValueCounts(data, selectedColumn), [data, selectedColumn]);

  const isActive = currentSort.column !== "" && currentSort.priorityValue !== null;
  const currentColumnLabel = sortableColumns.find(col => col.key === currentSort.column)?.label || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleOptionSelect = (value: string | null) => {
    onSortChange(selectedColumn, value);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    if (!isActive) return "Default Order";
    return `${currentColumnLabel}: ${currentSort.priorityValue}`;
  };

  if (sortableColumns.length === 0) return null;

  return (
    <div 
      className="sort-dropdown-container" 
      ref={dropdownRef}
      style={{ "--dropdown-accent": accentColor } as React.CSSProperties}
    >
      <button
        className={`sort-dropdown-trigger ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="trigger-icon">
          <SlidersHorizontal size={16} />
        </div>
        <div className="trigger-content">
          <span className="trigger-label">Show First</span>
          <span className="trigger-value">
            {isActive && <ArrowUp size={14} />}
            {getCurrentLabel()}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`trigger-chevron ${isOpen ? "rotated" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="sort-dropdown-menu" role="listbox">
          {/* Column selector if multiple sortable columns */}
          {sortableColumns.length > 1 && (
            <>
              <div className="dropdown-header">
                <span>Sort Column</span>
              </div>
              <div className="column-selector">
                {sortableColumns.map(col => (
                  <button
                    key={col.key}
                    className={`column-option ${selectedColumn === col.key ? "selected" : ""}`}
                    onClick={() => setSelectedColumn(col.key)}
                  >
                    {col.label}
                    {selectedColumn === col.key && <Check size={14} />}
                  </button>
                ))}
              </div>
              <div className="dropdown-divider"></div>
            </>
          )}

          <div className="dropdown-header">
            <span>Prioritize by {sortableColumns.find(c => c.key === selectedColumn)?.label || "Status"}</span>
          </div>
          
          <div className="dropdown-options">
            {/* Default option */}
            <button
              className={`dropdown-option ${!isActive ? "selected" : ""}`}
              onClick={() => handleOptionSelect(null)}
              role="option"
              aria-selected={!isActive}
            >
              <div className="option-icon default">
                <ArrowUpDown size={18} />
              </div>
              <div className="option-content">
                <span className="option-label">Default Order</span>
                <span className="option-description">Show all items as loaded</span>
              </div>
              {!isActive && (
                <div className="option-check">
                  <Check size={16} />
                </div>
              )}
            </button>

            {/* Divider */}
            {uniqueValues.length > 0 && <div className="dropdown-divider"></div>}

            {/* Dynamic status options */}
            {uniqueValues.map((value) => {
              const count = valueCounts[value] || 0;
              const isSelected = currentSort.column === selectedColumn && currentSort.priorityValue === value;
              
              return (
                <button
                  key={value}
                  className={`dropdown-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleOptionSelect(value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="option-icon status">
                    <Circle size={18} />
                  </div>
                  <div className="option-content">
                    <span className="option-label">{value}</span>
                    <span className="option-description">{count} {count === 1 ? 'item' : 'items'}</span>
                  </div>
                  <div className="option-count-badge">{count}</div>
                  {isSelected && (
                    <div className="option-check">
                      <Check size={16} />
                    </div>
                  )}
                </button>
              );
            })}

            {uniqueValues.length === 0 && (
              <div className="dropdown-empty">
                <span>No values found for this column</span>
              </div>
            )}
          </div>
          
          {isActive && (
            <div className="dropdown-footer">
              <button 
                className="clear-sort-btn"
                onClick={() => handleOptionSelect(null)}
              >
                <X size={14} />
                Clear Selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Table Header Sort Indicator
interface TableSortIndicatorProps {
  column: string;
  currentSort: SortConfig;
  uniqueValues: string[];
  onSort: (column: string, value: string | null) => void;
}

function TableSortIndicator({ column, currentSort, uniqueValues, onSort }: TableSortIndicatorProps) {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  
  const isActive = currentSort.column === column && currentSort.priorityValue !== null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className="table-sort-wrapper" ref={popupRef}>
      <button 
        className={`table-sort-indicator ${isActive ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(!showPopup);
        }}
        title="Click to sort"
      >
        {isActive ? <ArrowUp size={14} /> : <ArrowUpDown size={14} />}
      </button>
      
      {showPopup && (
        <div className="table-sort-popup">
          <div className="popup-header">Show First</div>
          <button 
            className={`popup-option ${!isActive ? "selected" : ""}`}
            onClick={() => { onSort(column, null); setShowPopup(false); }}
          >
            Default
          </button>
          {uniqueValues.map(value => (
            <button
              key={value}
              className={`popup-option ${currentSort.priorityValue === value && currentSort.column === column ? "selected" : ""}`}
              onClick={() => { onSort(column, value); setShowPopup(false); }}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDashboard({ onLogout }: ProductDashboardProps) {
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: "", priorityValue: null });
  
  // Global search states
  const [globalSearchResults, setGlobalSearchResults] = useState<GlobalSearchResult[]>([]);
  const [activeGlobalTab, setActiveGlobalTab] = useState<string>("");
  const [isGlobalSearching, setIsGlobalSearching] = useState<boolean>(false);
  const [globalSearchPerformed, setGlobalSearchPerformed] = useState<boolean>(false);
  const [globalSortConfigs, setGlobalSortConfigs] = useState<{ [key: string]: SortConfig }>({});

  const searchDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchRef = useRef("");

  const isGlobalSearchMode = !selectedManufacturer && searchQuery.length > 0;

  const hasSortableColumn = (manufacturerKey: string): boolean => {
    return getSortableColumns(manufacturerKey).length > 0;
  };

  // Sort function - prioritizes items with the selected status value
  const sortData = (data: any[], config: SortConfig): any[] => {
    if (!config.column || config.priorityValue === null) {
      return data;
    }
    
    if (!data || data.length === 0) {
      return data;
    }

    const priorityValue = config.priorityValue.toLowerCase().trim();

    return [...data].sort((a, b) => {
      const aValue = String(a[config.column] || "").toLowerCase().trim();
      const bValue = String(b[config.column] || "").toLowerCase().trim();

      const aMatches = aValue === priorityValue;
      const bMatches = bValue === priorityValue;

      // Prioritized items come first
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      
      // If both match or neither match, keep original order
      return 0;
    });
  };

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    return sortData(products, sortConfig);
  }, [products, sortConfig]);

  // Get sorted global results
  const getSortedGlobalData = (manufacturerKey: string, data: any[]): any[] => {
    const config = globalSortConfigs[manufacturerKey];
    if (!config || config.priorityValue === null) {
      return data;
    }
    return sortData(data, config);
  };

  // Handle sort from dropdown
  const handleSortFromDropdown = (column: string, priorityValue: string | null) => {
    setSortConfig({ column: priorityValue ? column : "", priorityValue });
  };

  // Handle sort from table header
  const handleSort = (column: string, value: string | null) => {
    setSortConfig({ column: value ? column : "", priorityValue: value });
  };

  // Handle global sort from dropdown
  const handleGlobalSortFromDropdown = (manufacturerKey: string, column: string, priorityValue: string | null) => {
    setGlobalSortConfigs(prev => ({
      ...prev,
      [manufacturerKey]: { column: priorityValue ? column : "", priorityValue }
    }));
  };

  // Handle global sort from table header
  const handleGlobalSort = (manufacturerKey: string, column: string, value: string | null) => {
    setGlobalSortConfigs(prev => ({
      ...prev,
      [manufacturerKey]: { column: value ? column : "", priorityValue: value }
    }));
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!selectedManufacturer) return;

    setLoading(true);
    try {
      const table = tableMap[selectedManufacturer];
      const url = `https://k6yilzfl19.execute-api.us-east-1.amazonaws.com/products?table=${table}&page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const json = await res.json();

      const data = json?.data?.[table]?.data || [];
      const count = json?.data?.[table]?.count || 0;

      setProducts(data);
      setTotalCount(count);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedManufacturer, currentPage, searchQuery]);

  // Global search
  const performGlobalSearch = useCallback(async () => {
    if (!searchQuery || selectedManufacturer) return;

    setIsGlobalSearching(true);
    setGlobalSearchPerformed(true);

    const initialResults: GlobalSearchResult[] = Object.keys(manufacturerData).map((key) => ({
      manufacturerKey: key,
      data: [],
      count: 0,
      loading: true,
      error: false,
    }));
    setGlobalSearchResults(initialResults);

    const fetchPromises = Object.keys(manufacturerData).map(async (key) => {
      try {
        const table = tableMap[key];
        const url = `https://k6yilzfl19.execute-api.us-east-1.amazonaws.com/products?table=${table}&page=1&limit=${PAGE_SIZE}&search=${encodeURIComponent(searchQuery)}`;

        const res = await fetch(url);
        const json = await res.json();

        const data = json?.data?.[table]?.data || [];
        const count = json?.data?.[table]?.count || 0;

        return { manufacturerKey: key, data, count, loading: false, error: false };
      } catch (err) {
        console.error(`Fetch error for ${key}:`, err);
        return { manufacturerKey: key, data: [], count: 0, loading: false, error: true };
      }
    });

    const results = await Promise.all(fetchPromises);
    setGlobalSearchResults(results);
    setIsGlobalSearching(false);

    const firstWithResults = results.find((r) => r.count > 0);
    setActiveGlobalTab(firstWithResults?.manufacturerKey || "");
  }, [searchQuery, selectedManufacturer]);

  // Search debounce effect
  useEffect(() => {
    if (searchDelayRef.current) clearTimeout(searchDelayRef.current);

    if (searchQuery.length > 0) {
      setIsSearching(true);
      searchDelayRef.current = setTimeout(() => {
        setIsSearching(false);
        if (selectedManufacturer) {
          fetchData();
        } else {
          performGlobalSearch();
        }
      }, 500);
    } else {
      setIsSearching(false);
      setGlobalSearchResults([]);
      setGlobalSearchPerformed(false);
      setActiveGlobalTab("");
    }

    return () => {
      if (searchDelayRef.current) clearTimeout(searchDelayRef.current);
    };
  }, [searchQuery, selectedManufacturer, fetchData, performGlobalSearch]);

  // Fetch on manufacturer/page change
  useEffect(() => {
    if (selectedManufacturer) {
      fetchData();
    }
  }, [selectedManufacturer, currentPage, fetchData]);

  // Reset on manufacturer change
  useEffect(() => {
    setCurrentPage(1);
    setExpandedRows([]);
    setSortConfig({ column: "", priorityValue: null });
    if (selectedManufacturer) {
      setGlobalSearchResults([]);
      setGlobalSearchPerformed(false);
      setActiveGlobalTab("");
    }
  }, [selectedManufacturer]);

  // Reset page on search change
  useEffect(() => {
    const isNewSearch = searchQuery !== lastSearchRef.current;
    if (isNewSearch) {
      setCurrentPage(1);
      lastSearchRef.current = searchQuery;
    }
  }, [searchQuery]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getManufacturerIcon = (iconType: string, size = 24) => {
    const iconProps = { size, strokeWidth: 1.5 };
    switch (iconType) {
      case "sofa": return <Sofa {...iconProps} />;
      case "armchair": return <Armchair {...iconProps} />;
      case "armchair2": return <Armchair {...iconProps} />;
      case "lamp": return <Lamp {...iconProps} />;
      case "bed": return <BedDouble {...iconProps} />;
      case "cart": return <ShoppingCart {...iconProps} />;
      case "warehouse": return <Warehouse {...iconProps} />;
      case "box": return <Box {...iconProps} />;
      case "tag": return <Tag {...iconProps} />;
      default: return <Package {...iconProps} />;
    }
  };

  const formatCellValue = (value: any, key: string) => {
    if (value === null || value === undefined) return "-";

    // Check if the value is already a formatted price string (starts with $)
    if (["msrp", "price", "amount", "retail_price", "your_price", "product_details_int1"].includes(key)) {
      if (typeof value === "string" && value.startsWith("$")) {
        return value;
      }
      if (value) {
        return `$${parseFloat(value).toFixed(2)}`;
      }
    }

    if (["quantity", "received_qty", "pending_qty", "total_qty", "inventory_qtyvalue", "qty_in_stock", "in_stock", "next_avail"].includes(key) && value) {
      return parseFloat(value).toLocaleString();
    }

    if ((key.includes("date") || key.includes("updated") || key.includes("time") || key === "received_at") && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }

    // Boolean-like fields
    if (key === "discontinued") {
      if (value === true || value === "true" || value === 1 || value === "1") return "Yes";
      if (value === false || value === "false" || value === 0 || value === "0") return "No";
    }

    return value;
  };

  const handleClearSelection = () => {
    setSelectedManufacturer("");
    setProducts([]);
    setTotalCount(0);
    setExpandedRows([]);
    setSortConfig({ column: "", priorityValue: null });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setGlobalSearchResults([]);
    setGlobalSearchPerformed(false);
    setActiveGlobalTab("");
    setGlobalSortConfigs({});
  };

  const getTotalGlobalResults = () => globalSearchResults.reduce((acc, r) => acc + r.count, 0);
  const getManufacturersWithResults = () => globalSearchResults.filter((r) => r.count > 0).length;

  const activeGlobalResult = globalSearchResults.find((r) => r.manufacturerKey === activeGlobalTab);

  return (
    <div className="dashboard-container">
      {/* Background Effects */}
      <div className="bg-gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Header */}
      <div className="dashboard-header-container">
        <div className="sparkle-wrapper">
          <Sparkles className="sparkle sparkle-1" />
          <Sparkles className="sparkle sparkle-2" />
          <Sparkles className="sparkle sparkle-3" />
        </div>
        <div className="dashboard-header">
          <div className="header-glow"></div>
          <div className="header-icon-wrapper">
            <Database className="header-icon" />
            <div className="icon-pulse"></div>
          </div>
          <div className="header-content">
            <h1 className="header-title">Database Product Dashboard</h1>
            <p className="header-subtitle">
              Real-time inventory and product management across all manufacturers
            </p>
          </div>
          
          {/* Logout Button - Inside Header */}
          {onLogout && (
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="global-search-section">
        <div className="search-mode-indicator">
          {selectedManufacturer ? (
            <div className="mode-badge filtered">
              <Filter size={14} />
              <span>Searching in {manufacturerData[selectedManufacturer].name}</span>
            </div>
          ) : (
            <div className="mode-badge global">
              <Globe size={14} />
              <span>Global Search - All Manufacturers</span>
            </div>
          )}
        </div>
        
        <div className="search-container-main">
          <div className="search-icon-wrapper-main">
            {isSearching || isGlobalSearching ? (
              <Loader2 className="search-icon spinning" size={22} />
            ) : (
              <Search className="search-icon" size={22} />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              selectedManufacturer
                ? `Search in ${manufacturerData[selectedManufacturer].name}...`
                : "Search across all manufacturers..."
            }
            className="search-input-main"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={handleClearSearch}>
              <X size={18} />
            </button>
          )}
        </div>

        {isGlobalSearchMode && globalSearchPerformed && !isGlobalSearching && (
          <div className="global-search-summary">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-number">{getTotalGlobalResults().toLocaleString()}</span>
                <span className="stat-text">Total Results</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-stat">
                <span className="stat-number">{getManufacturersWithResults()}</span>
                <span className="stat-text">Manufacturers</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manufacturer Selection Grid */}
      <div className="section-container">
        <div className="section-header">
          <div className="section-title">
            <LayoutGrid size={20} />
            <span>{isGlobalSearchMode ? "Filter by Manufacturer" : "Select Manufacturer"}</span>
          </div>
          {selectedManufacturer && (
            <button className="clear-selection-btn" onClick={handleClearSelection}>
              <X size={16} />
              Clear Selection
            </button>
          )}
        </div>

        <div className="manufacturer-grid">
          {Object.entries(manufacturerData).map(([key, data]) => {
            const globalResult = globalSearchResults.find((r) => r.manufacturerKey === key);
            const hasResults = globalResult && globalResult.count > 0;
            const isLoading = globalResult?.loading;
            const hasError = globalResult?.error;

            return (
              <button
                key={key}
                className={`manufacturer-card ${selectedManufacturer === key ? "active" : ""} ${
                  isGlobalSearchMode && hasResults ? "has-results" : ""
                } ${isGlobalSearchMode && !hasResults && globalSearchPerformed && !isLoading ? "no-results" : ""}`}
                onClick={() => {
                  setSelectedManufacturer(key);
                  setExpandedRows([]);
                }}
                style={{
                  "--card-color": data.color,
                  "--card-color-rgb": hexToRgb(data.color),
                } as React.CSSProperties}
              >
                <div className="card-glow"></div>
                <div className="card-icon">{getManufacturerIcon(data.icon)}</div>
                <div className="card-info">
                  <span className="card-name">{data.name}</span>
                  <span className="card-description">{data.description}</span>
                </div>
                
                {isGlobalSearchMode && globalSearchPerformed && (
                  <div className="result-indicator">
                    {isLoading ? (
                      <div className="result-loading"><Loader2 size={16} className="spinning" /></div>
                    ) : hasError ? (
                      <div className="result-error"><AlertCircle size={16} /></div>
                    ) : hasResults ? (
                      <div className="result-count">
                        <CheckCircle2 size={14} />
                        <span>{globalResult.count.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="result-none">0</div>
                    )}
                  </div>
                )}

                {selectedManufacturer === key && (
                  <div className="active-indicator"><div className="active-dot"></div></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Search Results */}
      {isGlobalSearchMode && globalSearchPerformed && (
        <div className="global-results-section">
          {isGlobalSearching ? (
            <div className="global-loading">
              <div className="loading-spinner-large"><Loader2 className="spinner-icon-large" /></div>
              <h3>Searching across all manufacturers...</h3>
              <p>This may take a moment</p>
              <div className="loading-progress"><div className="loading-progress-bar"></div></div>
            </div>
          ) : getTotalGlobalResults() === 0 ? (
            <div className="global-no-results">
              <div className="no-results-icon"><Search size={48} /></div>
              <h3>No results found</h3>
              <p>No products matching "{searchQuery}" were found in any manufacturer</p>
            </div>
          ) : (
            <>
              <div className="global-tabs-container">
                <div className="global-tabs-header">
                  <h3><Globe size={18} /> Search Results</h3>
                </div>
                <div className="global-tabs">
                  {globalSearchResults.filter((r) => r.count > 0).map((result) => (
                    <button
                      key={result.manufacturerKey}
                      className={`global-tab ${activeGlobalTab === result.manufacturerKey ? "active" : ""}`}
                      onClick={() => { setActiveGlobalTab(result.manufacturerKey); setExpandedRows([]); }}
                      style={{
                        "--tab-color": manufacturerData[result.manufacturerKey].color,
                        "--tab-color-rgb": hexToRgb(manufacturerData[result.manufacturerKey].color),
                      } as React.CSSProperties}
                    >
                      <span className="tab-icon">{getManufacturerIcon(manufacturerData[result.manufacturerKey].icon, 16)}</span>
                      <span className="tab-name">{manufacturerData[result.manufacturerKey].name}</span>
                      <span className="tab-count">{result.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeGlobalResult && (
                <div className="global-results-table">
                  <div className="table-header">
                    <div className="table-title" style={{ "--accent-color": manufacturerData[activeGlobalTab].color } as React.CSSProperties}>
                      <div className="title-icon">{getManufacturerIcon(manufacturerData[activeGlobalTab].icon, 20)}</div>
                      <span>{manufacturerData[activeGlobalTab].name} Results</span>
                      <span className="title-count">({activeGlobalResult.count.toLocaleString()} products)</span>
                    </div>
                    <div className="table-actions">
                      {hasSortableColumn(activeGlobalTab) && (
                        <SortDropdown
                          currentSort={globalSortConfigs[activeGlobalTab] || { column: "", priorityValue: null }}
                          sortableColumns={getSortableColumns(activeGlobalTab)}
                          onSortChange={(column, value) => handleGlobalSortFromDropdown(activeGlobalTab, column, value)}
                          accentColor={manufacturerData[activeGlobalTab].color}
                          data={activeGlobalResult.data}
                        />
                      )}
                      <button className="view-all-btn" onClick={() => setSelectedManufacturer(activeGlobalTab)}>
                        View All with Pagination
                        <ChevronDown size={16} style={{ transform: "rotate(-90deg)" }} />
                      </button>
                    </div>
                  </div>

                  <div className="table-content">
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            {manufacturerColumns[activeGlobalTab].map((col) => (
                              <th key={col.key} className={`${col.sortable ? "sortable" : ""} ${col.key === "description" || col.key === "product_name" || col.key === "productname" || col.key === "name" || col.key === "item_name" ? "wide-column" : ""}`}>
                                <div className="th-content">
                                  {col.label}
                                  {col.sortable && (
                                    <TableSortIndicator
                                      column={col.key}
                                      currentSort={globalSortConfigs[activeGlobalTab] || { column: "", priorityValue: null }}
                                      uniqueValues={getUniqueValues(activeGlobalResult.data, col.key)}
                                      onSort={(column, value) => handleGlobalSort(activeGlobalTab, column, value)}
                                    />
                                  )}
                                </div>
                              </th>
                            ))}
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSortedGlobalData(activeGlobalTab, activeGlobalResult.data).map((row, i) => (
                            <Fragment key={i}>
                              <tr className={expandedRows.includes(i) ? "expanded" : ""}>
                                {manufacturerColumns[activeGlobalTab].map((col) => (
                                  <td key={col.key} className={col.key === "description" || col.key === "product_name" || col.key === "productname" || col.key === "name" || col.key === "item_name" ? "wide-cell" : ""}>
                                    <span className={`cell-content ${col.key === "description" || col.key === "product_name" || col.key === "productname" || col.key === "name" || col.key === "item_name" ? "full-text" : ""}`}>
                                      {formatCellValue(row[col.key], col.key)}
                                    </span>
                                  </td>
                                ))}
                                <td>
                                  <button onClick={() => toggleRow(i)} className={`expand-button ${expandedRows.includes(i) ? "active" : ""}`}>
                                    {expandedRows.includes(i) ? <><ChevronUp size={16} /><span>Hide</span></> : <><ChevronDown size={16} /><span>Details</span></>}
                                  </button>
                                </td>
                              </tr>
                              {expandedRows.includes(i) && (
                                <tr className="expanded-row">
                                  <td colSpan={manufacturerColumns[activeGlobalTab].length + 1}>
                                    <div className="json-container">
                                      <div className="json-header">
                                        <span>Raw Data</span>
                                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(row, null, 2))}>Copy JSON</button>
                                      </div>
                                      <pre className="json-content">{JSON.stringify(row, null, 2)}</pre>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {activeGlobalResult.count > PAGE_SIZE && (
                      <div className="global-pagination-notice">
                        <p>Showing first {PAGE_SIZE} of {activeGlobalResult.count.toLocaleString()} results.</p>
                        <button className="view-all-link" onClick={() => setSelectedManufacturer(activeGlobalTab)}>
                          Select {manufacturerData[activeGlobalTab].name} to view all with pagination
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Single Manufacturer Stats */}
      {selectedManufacturer && (
        <div className="search-stats-bar">
          <div className="stats-content">
            <span className="stat-item">
              <span className="stat-value">{totalCount.toLocaleString()}</span>
              <span className="stat-label">Total Products</span>
            </span>
            <span className="stat-divider"></span>
            <span className="stat-item">
              <span className="stat-value">{Math.ceil(totalCount / PAGE_SIZE)}</span>
              <span className="stat-label">Pages</span>
            </span>
            <span className="stat-divider"></span>
            <span className="stat-item">
              <span className="stat-value">{currentPage}</span>
              <span className="stat-label">Current Page</span>
            </span>
            {sortConfig.priorityValue && (
              <>
                <span className="stat-divider"></span>
                <span className="stat-item sort-active">
                  <span className="stat-value"><ArrowUp size={16} /></span>
                  <span className="stat-label">"{sortConfig.priorityValue}" first</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Single Manufacturer Table */}
      {selectedManufacturer && (
        <div className="table-section">
          <div className="table-header">
            <div className="table-title" style={{ "--accent-color": manufacturerData[selectedManufacturer].color } as React.CSSProperties}>
              <div className="title-icon">{getManufacturerIcon(manufacturerData[selectedManufacturer].icon, 20)}</div>
              <span>{manufacturerData[selectedManufacturer].name} Products</span>
            </div>
            
            {hasSortableColumn(selectedManufacturer) && (
              <SortDropdown
                currentSort={sortConfig}
                sortableColumns={getSortableColumns(selectedManufacturer)}
                onSortChange={handleSortFromDropdown}
                accentColor={manufacturerData[selectedManufacturer].color}
                data={products}
              />
            )}
          </div>

          <div className="table-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"><Loader2 className="spinner-icon" /></div>
                <span className="loading-text">Loading products...</span>
                <div className="loading-bar"><div className="loading-bar-progress"></div></div>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Package size={48} /></div>
                <h3>No products found</h3>
                <p>Try adjusting your search query</p>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {manufacturerColumns[selectedManufacturer].map((col) => (
                          <th key={col.key} className={`${col.sortable ? "sortable" : ""} ${col.key === "description" || col.key === "product_name" || col.key === "productname" || col.key === "name" || col.key === "item_name" ? "wide-column" : ""}`}>
                            <div className="th-content">
                              {col.label}
                              {col.sortable && (
                                <TableSortIndicator
                                  column={col.key}
                                  currentSort={sortConfig}
                                  uniqueValues={getUniqueValues(products, col.key)}
                                  onSort={handleSort}
                                />
                              )}
                            </div>
                          </th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.map((row, i) => (
                        <Fragment key={`${row.id || row.sku || i}-${i}`}>
                          <tr className={expandedRows.includes(i) ? "expanded" : ""}>
                            {manufacturerColumns[selectedManufacturer].map((col) => (
                              <td key={col.key} className={col.key === "description" || col.key === "product_name" || col.key === "productname" || col.key === "name" || col.key === "item_name" ? "wide-cell" : ""}>
                                <span className={`cell-content ${col.key === "description" || col.key === "product_name" || col.key === "productname" || col.key === "name" || col.key === "item_name" ? "full-text" : ""}`}>
                                  {formatCellValue(row[col.key], col.key)}
                                </span>
                              </td>
                            ))}
                            <td>
                              <button onClick={() => toggleRow(i)} className={`expand-button ${expandedRows.includes(i) ? "active" : ""}`}>
                                {expandedRows.includes(i) ? <><ChevronUp size={16} /><span>Hide</span></> : <><ChevronDown size={16} /><span>Details</span></>}
                              </button>
                            </td>
                          </tr>
                          {expandedRows.includes(i) && (
                            <tr className="expanded-row">
                              <td colSpan={manufacturerColumns[selectedManufacturer].length + 1}>
                                <div className="json-container">
                                  <div className="json-header">
                                    <span>Raw Data</span>
                                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(row, null, 2))}>Copy JSON</button>
                                  </div>
                                  <pre className="json-content">{JSON.stringify(row, null, 2)}</pre>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination-container">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-btn">
                    <ChevronUp size={16} style={{ transform: "rotate(-90deg)" }} /> Previous
                  </button>

                  <div className="pagination-pages">
                    {generatePageNumbers(currentPage, Math.ceil(totalCount / PAGE_SIZE)).map((page, idx) =>
                      page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                      ) : (
                        <button key={page} onClick={() => setCurrentPage(page as number)} className={`pagination-page ${currentPage === page ? "active" : ""}`}>
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button onClick={() => setCurrentPage((p) => (p < Math.ceil(totalCount / PAGE_SIZE) ? p + 1 : p))} disabled={currentPage >= Math.ceil(totalCount / PAGE_SIZE)} className="pagination-btn">
                    Next <ChevronUp size={16} style={{ transform: "rotate(90deg)" }} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Welcome State */}
      {!selectedManufacturer && !searchQuery && (
        <div className="welcome-state">
          <div className="welcome-content">
            <div className="welcome-icon"><Database size={64} /></div>
            <h2>Welcome to the Product Dashboard</h2>
            <p>Search globally across all manufacturers or select one to browse</p>
            <div className="welcome-features">
              <div className="feature-item"><Globe size={20} /><span>Global Search</span></div>
              <div className="feature-item"><Filter size={20} /><span>Filter by Source</span></div>
              <div className="feature-item"><Package size={20} /><span>Detailed Views</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "139, 92, 246";
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 2) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}