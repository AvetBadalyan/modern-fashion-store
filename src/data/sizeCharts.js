// Illustrative size charts shared by the size-guide modal and the size-guide page.
export const WOMEN_CHART = {
  title: "Women's apparel",
  head: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
  rows: [
    ['XS', '32-34', '25-27', '35-37'],
    ['S', '35-37', '28-30', '38-40'],
    ['M', '38-40', '31-33', '41-43'],
    ['L', '41-43', '34-36', '44-46'],
    ['XL', '44-46', '37-40', '47-49']
  ]
}

export const MEN_CHART = {
  title: "Men's apparel",
  head: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
  rows: [
    ['XS', '34-36', '28-30', '34-36'],
    ['S', '36-38', '30-32', '36-38'],
    ['M', '38-40', '32-34', '38-40'],
    ['L', '40-42', '34-36', '40-42'],
    ['XL', '42-44', '36-38', '42-44']
  ]
}

export const SHOE_CHART = {
  title: 'Shoes',
  head: ['EU', 'UK', 'US', 'Foot length (cm)'],
  rows: [
    ['38', '5', '6', '24.1'],
    ['39', '6', '7', '24.8'],
    ['40', '6.5', '7.5', '25.4'],
    ['41', '7.5', '8.5', '26.0'],
    ['42', '8', '9', '26.7'],
    ['43', '9', '10', '27.3'],
    ['44', '9.5', '10.5', '27.9']
  ]
}

// Pick the chart that matches a product category (men / shoes / everything else).
export const chartForCategory = (category) => {
  if (category === 'shoes') return SHOE_CHART
  if (category === 'men') return MEN_CHART
  return WOMEN_CHART
}
