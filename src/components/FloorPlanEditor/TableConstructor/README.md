# TableConstructor - Структура модуля

Этот документ описывает структуру модуля `TableConstructor` после рефакторинга.

## Структура папок

```
TableConstructor/
├── constants/          # Константы (размеры, цвета, значения по умолчанию)
│   └── index.ts
├── types/             # TypeScript типы и интерфейсы
│   └── index.ts
├── hooks/             # Кастомные React хуки
│   ├── useTableConstructor.ts
│   └── index.ts
├── utils/             # Утилиты
│   ├── furniturePosition.ts  # Вычисление позиций мебели
│   ├── grid.ts              # Генерация сетки
│   └── index.ts
├── components/        # UI компоненты
│   └── TablePreview.tsx     # Компонент превью стола
└── index.ts           # Экспорты модуля
```

## Что было сделано

1. ✅ Выделены типы в `types/index.ts`
2. ✅ Выделены константы в `constants/index.ts`
3. ✅ Создан хук `useTableConstructor` для управления состоянием
4. ✅ Созданы утилиты для вычисления позиций мебели и генерации сетки
5. ✅ Создан компонент `TablePreview` для превью стола

## Что осталось сделать

1. ⏳ Создать компоненты:
   - `FurniturePalette` - палитра выбора мебели
   - `ShapeSelector` - выбор формы стола
   - `DimensionControls` - контролы размеров и углов
   - `FurnitureZones` - зоны для размещения мебели

2. ⏳ Обновить главный компонент `TableConstructorModal.tsx` для использования созданных модулей

3. ⏳ Вынести рендеринг мебели в отдельный компонент (можно переиспользовать `FurnitureRenderer`)

