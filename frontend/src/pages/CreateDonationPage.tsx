import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Utensils, ShieldAlert, MapPin, Image as ImageIcon, Clock, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const CreateDonationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Step 1: Food Info
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('kg');
  const [servings, setServings] = useState<number>(30);

  // Step 2: Food Safety
  const [dietaryType, setDietaryType] = useState<'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN'>('VEGETARIAN');
  const [allergens, setAllergens] = useState('');
  const [preparedAt, setPreparedAt] = useState(new Date().toISOString().slice(0, 16));
  const [expiresAt, setExpiresAt] = useState(new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16));

  // Step 3: Pickup Location & Timing
  const [pickupStart, setPickupStart] = useState(new Date().toISOString().slice(0, 16));
  const [pickupEnd, setPickupEnd] = useState(new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 16));
  const [address, setAddress] = useState('100 Feet Rd, Indiranagar');
  const [city, setCity] = useState('Bengaluru');

  // Step 4: Image Picker
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  );

  const [submitting, setSubmitting] = useState(false);

  const sampleImages = [
    { label: 'Cooked Bowls', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Fresh Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Gourmet Pasta', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80' },
    { label: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sandwich Trays', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName || !description || !address || !city) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch('/donations', {
        method: 'POST',
        body: JSON.stringify({
          foodName,
          category,
          description,
          quantity: Number(quantity),
          unit,
          servings: Number(servings),
          dietaryType,
          allergens: allergens.trim() || undefined,
          preparedAt: new Date(preparedAt).toISOString(),
          expiresAt: new Date(expiresAt).toISOString(),
          pickupStart: new Date(pickupStart).toISOString(),
          pickupEnd: new Date(pickupEnd).toISOString(),
          address,
          city,
          latitude: 12.9784,
          longitude: 77.6408,
          imageUrl
        })
      });

      showToast('Food donation listed successfully!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to create food listing.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            <span>Food Donor Listing Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Donate Surplus Food</h1>
          <p className="text-xs text-slate-500">Provide accurate food details to facilitate fast and safe rescue operations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Food Info */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <Utensils className="w-4 h-4 text-emerald-600" />
              1. Food Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Fresh Baked Sourdough Loaves"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Food Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery & Bread">Bakery & Bread</option>
                  <option value="Produce & Fruits">Produce & Fruits</option>
                  <option value="Groceries & Packaged">Groceries & Packaged</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Quality Notes *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe preparation method, packaging condition, warming state..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="meals">meals (Portions)</option>
                  <option value="boxes">boxes (Trays)</option>
                  <option value="items">items</option>
                  <option value="liters">liters</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Servings *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Safety & Dietary */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-teal-500 pl-3">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              2. Food Safety & Dietary Controls
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary Status *</label>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="VEGAN">Vegan</option>
                  <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allergens (Optional)</label>
                <input
                  type="text"
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                  placeholder="e.g. Nuts, Dairy, Gluten, Soy"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prepared At *</label>
                <input
                  type="datetime-local"
                  required
                  value={preparedAt}
                  onChange={(e) => setPreparedAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Best Before / Expiry *</label>
                <input
                  type="datetime-local"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pickup Location & Slot */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-sky-500 pl-3">
              <MapPin className="w-4 h-4 text-sky-600" />
              3. Pickup Location & Availability Window
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Available From *</label>
                <input
                  type="datetime-local"
                  required
                  value={pickupStart}
                  onChange={(e) => setPickupStart(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Available Until *</label>
                <input
                  type="datetime-local"
                  required
                  value={pickupEnd}
                  onChange={(e) => setPickupEnd(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Image */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-purple-500 pl-3">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              4. Food Listing Image
            </h2>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Select Preset Photo or Enter URL</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`p-1 rounded-xl border-2 overflow-hidden transition ${
                      imageUrl === img.url ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-14 object-cover rounded-lg" />
                    <span className="text-[9px] font-semibold text-slate-600 block text-center mt-1 truncate">{img.label}</span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Publishing Listing...' : 'Publish Food Donation'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
