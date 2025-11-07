# Приклади параметрів симуляції для SimuHub AI

Цей документ містить приклади запитів та параметрів для різних типів наукових симуляцій.

---

## 🔬 Метали (Metals)

### Приклад 1: Вивчення термічної обробки сталі

**Research Goal:**

```
Analyze the thermal treatment process for improving the mechanical properties of carbon steel through quenching and tempering. The goal is to optimize temperature profiles to achieve optimal hardness and toughness balance for structural applications.
```

**Material Type:** `metals`

**Composition:**

```
Fe 98%, C 0.4%, Mn 0.6%, Si 0.3%, P 0.03%, S 0.02%
```

**Experimental Conditions:**

```
Quenching temperature: 850°C, Quenching medium: Oil, Tempering temperature: 400-600°C, Holding time: 2 hours, Cooling rate: 50°C/min
```

---

### Приклад 2: Корозійна стійкість нержавіючої сталі

**Research Goal:**

```
Investigate the corrosion resistance of stainless steel in marine environments. Evaluate the effect of chromium and nickel content on pitting corrosion resistance and passive film formation.
```

**Material Type:** `metals`

**Composition:**

```
Fe 70%, Cr 18%, Ni 8%, Mo 3%, C 0.08%, Mn 1%, Si 0.5%
```

**Experimental Conditions:**

```
Temperature: 25°C (ambient), Pressure: 1 atm, Environment: 3.5% NaCl solution, pH: 7-8, Exposure time: 1000 hours, Electrochemical potential: +0.3V vs SCE
```

---

## 🧪 Полімери (Polymers)

### Приклад 3: Механічні властивості поліетилену

**Research Goal:**

```
Optimize the mechanical properties of high-density polyethylene (HDPE) by analyzing the effects of molecular weight distribution and processing conditions on tensile strength and impact resistance.
```

**Material Type:** `polymers`

**Composition:**

```
HDPE (High-Density Polyethylene): 95%, Additives (UV stabilizers, antioxidants): 3%, Impact modifiers: 2%
```

**Experimental Conditions:**

```
Processing temperature: 200-220°C, Injection pressure: 80-100 MPa, Cooling rate: 10°C/min, Mold temperature: 40°C, Holding pressure: 50 MPa, Crystallization temperature: 120°C
```

---

### Приклад 4: Термостабільність поліаміду

**Research Goal:**

```
Study the thermal degradation behavior of polyamide 6,6 under different temperature regimes. Analyze weight loss, mechanical property retention, and decomposition kinetics.
```

**Material Type:** `polymers`

**Composition:**

```
Polyamide 6,6: 85%, Glass fiber reinforcement: 15%, Thermal stabilizers: 0.5%
```

**Experimental Conditions:**

```
Temperature range: 150-300°C, Heating rate: 10°C/min, Isothermal hold: 200°C for 500 hours, Atmosphere: Air, Test method: TGA/DSC, Load: 10 MPa
```

---

## 🏺 Кераміка (Ceramics)

### Приклад 5: Спеціання алюмінієвого оксиду

**Research Goal:**

```
Optimize the sintering process for alumina ceramics to achieve maximum density and mechanical strength. Analyze the effect of sintering temperature, time, and heating rate on microstructure and properties.
```

**Material Type:** `ceramics`

**Composition:**

```
Al2O3: 99.5%, MgO sintering aid: 0.5%, Particle size: D50 = 0.5 μm
```

**Experimental Conditions:**

```
Sintering temperature: 1600-1700°C, Sintering time: 2-4 hours, Heating rate: 5°C/min, Cooling rate: 10°C/min, Atmosphere: Air, Applied pressure: 0 MPa (pressureless), Green density: 55% theoretical
```

---

### Приклад 6: Термофізичні властивості карбіду кремнію

**Research Goal:**

```
Evaluate the thermal conductivity and coefficient of thermal expansion of silicon carbide ceramics for high-temperature applications in aerospace components.
```

**Material Type:** `ceramics`

**Composition:**

```
SiC: 98%, B4C sintering aid: 1.5%, Free carbon: 0.5%, Density: 3.15 g/cm³
```

**Experimental Conditions:**

```
Test temperature range: 25-1200°C, Heating rate: 5°C/min, Measurement frequency: 10 MHz, Sample dimensions: 25×25×5 mm, Atmosphere: Inert (Argon)
```

---

## 🔗 Композити (Composites)

### Приклад 7: Вуглецево-волоконний композит

**Research Goal:**

```
Optimize the processing parameters for carbon fiber reinforced polymer (CFRP) composites to maximize interlaminar shear strength and reduce void content.
```

**Material Type:** `composites`

**Composition:**

```
Epoxy resin matrix: 40%, Carbon fiber (T300): 60%, Fiber orientation: [0/90]₂s, Fiber volume fraction: 0.6
```

**Experimental Conditions:**

```
Curing temperature: 180°C, Curing pressure: 0.6 MPa, Curing time: 2 hours, Post-curing: 200°C for 1 hour, Vacuum level: 0.1 atm, Heating rate: 2°C/min, Cooling rate: Natural cooling
```

---

### Приклад 8: Метал-матричний композит

**Research Goal:**

```
Investigate the mechanical behavior of aluminum matrix composite reinforced with silicon carbide particles. Analyze the effect of reinforcement volume fraction on tensile and fatigue properties.
```

**Material Type:** `composites`

**Composition:**

```
Aluminum 6061 matrix: 85%, SiC particles: 15%, Particle size: 10-15 μm, Particle distribution: Uniform
```

**Experimental Conditions:**

```
Processing: Stir casting, Casting temperature: 750°C, Stirring speed: 600 rpm, Stirring time: 10 minutes, Solidification rate: 5°C/min, Heat treatment: T6 condition (Solution treatment: 530°C for 1h, Aging: 175°C for 8h)
```

---

## ⚛️ Наноматеріали (Nanomaterials)

### Приклад 9: Нанокристалічна структура титану

**Research Goal:**

```
Study the grain size refinement and mechanical properties of nanocrystalline titanium produced through severe plastic deformation. Analyze the relationship between grain size and yield strength.
```

**Material Type:** `nanomaterials`

**Composition:**

```
Pure Ti (Grade 2): 99.9%, Average grain size target: < 100 nm, Oxygen content: < 0.15%, Nitrogen: < 0.05%
```

**Experimental Conditions:**

```
Processing method: ECAP (Equal Channel Angular Pressing), Processing temperature: 400°C, Number of passes: 8, Strain per pass: ~1, Total accumulated strain: ~8, Strain rate: 10⁻² s⁻¹, Annealing: None
```

---

### Приклад 10: Нанокомпозити на основі графену

**Research Goal:**

```
Investigate the electrical and thermal properties of graphene-reinforced polymer nanocomposites. Optimize graphene dispersion and concentration for enhanced conductivity.
```

**Material Type:** `nanomaterials`

**Composition:**

```
Polymer matrix (PMMA): 95%, Graphene nanoplatelets: 5%, Graphene layer count: 5-10 layers, Lateral size: 5-10 μm, Surface area: 750 m²/g
```

**Experimental Conditions:**

```
Dispersion method: Sonication in solvent, Processing temperature: 180°C, Mixing time: 30 minutes, Sonication power: 200 W, Frequency: 20 kHz, Vacuum drying: 80°C for 24 hours, Compression molding temperature: 180°C, Pressure: 10 MPa
```

---

## 🧬 Інші матеріали (Other)

### Приклад 11: Біоматеріали для медичних застосувань

**Research Goal:**

```
Develop a biodegradable polymer scaffold for tissue engineering applications. Analyze degradation rate, biocompatibility, and mechanical properties suitable for bone regeneration.
```

**Material Type:** `other`

**Composition:**

```
PLA (Polylactic acid): 70%, HA (Hydroxyapatite): 25%, Growth factors: 5%, Porosity: 80%, Pore size: 200-400 μm
```

**Experimental Conditions:**

```
3D printing temperature: 200°C, Layer thickness: 0.2 mm, Print speed: 50 mm/s, Degradation environment: PBS buffer (pH 7.4), Temperature: 37°C, Incubation time: 12 weeks, Mechanical testing: Compression at 1 mm/min
```

---

### Приклад 12: Електроматеріали для батарей

**Research Goal:**

```
Optimize the synthesis conditions for lithium iron phosphate (LiFePO4) cathode material for lithium-ion batteries. Maximize specific capacity and cycling stability.
```

**Material Type:** `other`

**Composition:**

```
LiFePO4: 90%, Carbon coating: 8%, Conductive additives: 2%, Particle size: D50 = 5 μm, Carbon coating thickness: 5-10 nm
```

**Experimental Conditions:**

```
Synthesis method: Hydrothermal, Temperature: 180°C, Pressure: 15 atm, Reaction time: 12 hours, Precursor concentration: 0.5 M, pH: 8-9, Post-treatment: Calcination at 700°C for 6 hours under Ar atmosphere, Carbon coating: 650°C for 2 hours
```

---

## 💡 Поради для кращих результатів:

### Research Goal:

- ✅ Будьте конкретними та детальними
- ✅ Вказуйте цільові властивості або характеристики
- ✅ Згадуйте область застосування
- ✅ Вказуйте основні параметри, що цікавлять

### Composition:

- ✅ Указуйте точні відсотки або співвідношення
- ✅ Згадайте домішки та добавки
- ✅ Для композитів вказуйте об'ємну/вагову частку компонентів
- ✅ Згадайте розмір частинок, якщо це важливо

### Experimental Conditions:

- ✅ Вказуйте діапазони температур та тиску
- ✅ Згадайте швидкості нагрівання/охолодження
- ✅ Вказуйте час обробки
- ✅ Згадайте атмосферу (повітря, азот, вакуум)
- ✅ Для механічних випробувань вказуйте швидкість деформації

---

## 📝 Шаблон для швидкого заповнення:

**Research Goal:**

```
[Опишіть мету дослідження: що ви хочете дізнатися або оптимізувати]
```

**Material Type:** `[metals/polymers/ceramics/composites/nanomaterials/other]`

**Composition:**

```
[Основний матеріал]: X%, [Додатки]: Y%, [Домішки]: Z%
```

**Experimental Conditions:**

```
Temperature: X°C, Pressure: Y MPa, Time: Z hours, [Інші важливі параметри]
```

---

_Використовуйте ці приклади як відправну точку для ваших власних симуляцій!_
