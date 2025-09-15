import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useThemeStore, ColorPalette, ShiftColorPalette } from '../stores/themeStore';
import { Settings, Palette, Building2 } from 'lucide-react';

export default function ThemeSettings() {
  const {
    currentTheme,
    availableColorPalettes,
    availableShiftPalettes,
    createCompanyTheme,
    setTheme,
    updateCompanyTheme,
  } = useThemeStore();

  const [companyName, setCompanyName] = useState(currentTheme?.companyName || '');
  const [selectedColorPalette, setSelectedColorPalette] = useState<string>(
    currentTheme?.colorPalette.id || 'blue-modern'
  );
  const [selectedShiftPalette, setSelectedShiftPalette] = useState<string>(
    currentTheme?.shiftColorPalette.id || 'professional'
  );

  const handleCreateTheme = () => {
    if (!companyName.trim()) return;

    const newTheme = createCompanyTheme(companyName, selectedColorPalette, selectedShiftPalette);
    setTheme(newTheme);
  };

  const handleUpdateTheme = () => {
    if (!currentTheme) return;

    const colorPalette = availableColorPalettes.find(p => p.id === selectedColorPalette);
    const shiftPalette = availableShiftPalettes.find(p => p.id === selectedShiftPalette);

    if (!colorPalette || !shiftPalette) return;

    updateCompanyTheme(currentTheme.companyId, {
      companyName,
      colorPalette,
      shiftColorPalette: shiftPalette,
    });
  };

  const renderColorPalette = (palette: ColorPalette, isSelected: boolean) => (
    <div
      key={palette.id}
      onClick={() => setSelectedColorPalette(palette.id)}
      style={{
        padding: '1rem',
        border: isSelected ? `2px solid ${palette.primary}` : '2px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s',
        boxShadow: isSelected ? `0 4px 12px ${palette.primary}30` : '0 2px 4px #00000010',
      }}
    >
      <div style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1e293b' }}>
        {palette.name}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[palette.primary, palette.secondary, palette.accent, palette.success, palette.warning].map((color, i) => (
          <div
            key={i}
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: color,
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>
        עיקרי: {palette.primary}
      </div>
    </div>
  );

  const renderShiftPalette = (palette: ShiftColorPalette, isSelected: boolean) => (
    <div
      key={palette.id}
      onClick={() => setSelectedShiftPalette(palette.id)}
      style={{
        padding: '1rem',
        border: isSelected ? '2px solid #3b82f6' : '2px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s',
        boxShadow: isSelected ? '0 4px 12px #3b82f630' : '0 2px 4px #00000010',
      }}
    >
      <div style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1e293b' }}>
        {palette.name}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {palette.colors.map((color, i) => (
          <div
            key={i}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
          הגדרות עיצוב ונושא
        </h1>
        <p style={{ color: '#64748b' }}>
          בחרו צבעים ונושא עבור החברה שלכם
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '1200px' }}>
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 style={{ width: '20px', height: '20px' }} />
              פרטי החברה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                שם החברה
              </label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="הכניסו שם החברה"
                style={{ height: '48px' }}
              />
            </div>
            <Button
              onClick={currentTheme ? handleUpdateTheme : handleCreateTheme}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                height: '48px',
              }}
            >
              {currentTheme ? 'עדכן הגדרות' : 'צור נושא חדש'}
            </Button>
          </CardContent>
        </Card>

        {/* Color Palettes */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette style={{ width: '20px', height: '20px' }} />
              פלטת צבעים לממשק
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {availableColorPalettes.map(palette =>
                renderColorPalette(palette, selectedColorPalette === palette.id)
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shift Color Palettes */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette style={{ width: '20px', height: '20px' }} />
              פלטת צבעים למשמרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {availableShiftPalettes.map(palette =>
                renderShiftPalette(palette, selectedShiftPalette === palette.id)
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {currentTheme && (
          <Card>
            <CardHeader>
              <CardTitle>תצוגה מקדימה</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ padding: '1.5rem', backgroundColor: currentTheme.colorPalette.background, borderRadius: '12px', border: `1px solid ${currentTheme.colorPalette.border}` }}>
                <h3 style={{ color: currentTheme.colorPalette.text, marginBottom: '1rem', fontSize: '1.5rem' }}>
                  {companyName || 'שם החברה'}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', backgroundColor: currentTheme.colorPalette.primary, color: 'white', borderRadius: '6px' }}>
                    כפתור עיקרי
                  </div>
                  <div style={{ padding: '0.5rem 1rem', backgroundColor: currentTheme.colorPalette.secondary, color: 'white', borderRadius: '6px' }}>
                    כפתור משני
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {currentTheme.shiftColorPalette.colors.slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: '60px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      משמרת
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}