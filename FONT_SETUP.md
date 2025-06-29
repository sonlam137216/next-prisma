# Cấu hình Font Montserrat

## Tổng quan
Website đã được cấu hình để sử dụng font Montserrat làm font chính cho toàn bộ website.

## Các file đã được cập nhật

### 1. `tailwind.config.js`
- Đã cấu hình `fontFamily.sans` để sử dụng Montserrat làm font mặc định
- Thêm `fontFamily.montserrat` để có thể sử dụng class `font-montserrat`

### 2. `app/globals.css`
- Import Google Fonts Montserrat với đầy đủ các trọng lượng (300-900)
- Cấu hình CSS variables để sử dụng Montserrat
- Thêm CSS rules để đảm bảo font được áp dụng cho tất cả các element

### 3. `app/montserrat-font.css`
- File CSS riêng để đảm bảo font Montserrat được áp dụng hoàn toàn
- Sử dụng `!important` để override các font khác

### 4. `app/layout.tsx`
- Import file CSS Montserrat
- Thêm class `font-sans` vào html và body

## Cách sử dụng

### Sử dụng class Tailwind CSS
```jsx
// Font mặc định (Montserrat)
<div className="font-sans">Text with Montserrat</div>

// Font Montserrat cụ thể
<div className="font-montserrat">Text with Montserrat</div>

// Các trọng lượng font
<div className="font-light">Light (300)</div>
<div className="font-normal">Normal (400)</div>
<div className="font-medium">Medium (500)</div>
<div className="font-semibold">Semibold (600)</div>
<div className="font-bold">Bold (700)</div>
<div className="font-extrabold">Extrabold (800)</div>
<div className="font-black">Black (900)</div>
```

### Sử dụng CSS thuần
```css
.my-element {
  font-family: 'Montserrat', ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
```

## Các trọng lượng font có sẵn
- 300 (Light)
- 400 (Normal/Regular)
- 500 (Medium)
- 600 (Semibold)
- 700 (Bold)
- 800 (Extrabold)
- 900 (Black)

## Lưu ý
- Font Montserrat sẽ được áp dụng tự động cho tất cả các element
- Nếu muốn sử dụng font khác cho một element cụ thể, cần override bằng CSS hoặc class Tailwind
- Font sẽ được load từ Google Fonts, đảm bảo kết nối internet ổn định

## Kiểm tra
Để kiểm tra font đã được áp dụng đúng:
1. Mở Developer Tools (F12)
2. Inspect element
3. Kiểm tra thuộc tính `font-family` trong tab Computed
4. Giá trị phải là `'Montserrat', ui-sans-serif, system-ui, ...` 