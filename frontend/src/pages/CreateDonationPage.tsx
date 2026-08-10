import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Utensils, ShieldAlert, MapPin, Image as ImageIcon, Clock, ArrowRight, Upload, Check } from 'lucide-react';
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

  // Step 4: Direct Photo Upload
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast('Food photo attached successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

      showToast('Food donation published successfully!', 'success');
      navigate('/find-food');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish donation.', 'error');
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
                  min="1"
                  required
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
                  <option value="kg">kg</option>
                  <option value="meals">meals</option>
                  <option value="boxes">boxes</option>
                  <option value="items">items</option>
                  <option value="liters">liters</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Servings *</label>
                <input
                  type="number"
                  min="1"
                  required
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
              2. Safety & Dietary Verification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary Type *</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Known Allergens (Comma separated)</label>
                <input
                  type="text"
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                  placeholder="e.g. Nuts, Dairy, Gluten"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prepared / Packed At *</label>
                <input
                  type="datetime-local"
                  required
                  value={preparedAt}
                  onChange={(e) => setPreparedAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Best Before / Expires At *</label>
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
                  placeholder="Bengaluru"
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

          {/* Section 4: Image Upload & Picker */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-l-4 border-purple-500 pl-3">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              4. Food Listing Photo
            </h2>

            <div className="space-y-4">
              
              {/* Upload Button */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Upload Photo from Device / Camera</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl p-6 cursor-pointer transition text-center group">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2 transition" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Click to Upload Food Image</span>
                  <span className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, WEBP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Active Image Preview */}
              {imageUrl && (
                <div className="flex items-center gap-4 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/80">
                  <img src={imageUrl} alt="Selected food preview" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-emerald-300" />
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                      <Check className="w-3.5 h-3.5" /> Photo Attached
                    </span>
                    <p className="text-[11px] text-slate-500 line-clamp-1">Image preview ready for publishing</p>
                  </div>
                </div>
              )}
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
