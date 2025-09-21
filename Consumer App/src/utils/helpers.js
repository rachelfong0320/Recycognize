export const formatPoints = (points) => {
  return points.toFixed(2)
}

export const getRecyclingTips = () => {
  return [
    "Clean containers before recycling",
    "Remove caps and lids from bottles",
    "Separate different materials",
    "Check local recycling guidelines",
  ]
}

export const getWasteTypes = () => {
  return [
    { name: "Plastic", color: "#FFE066", percentage: 35 },
    { name: "Glass", color: "#66B2FF", percentage: 25 },
    { name: "Aluminum", color: "#FF6B6B", percentage: 20 },
    { name: "Carton", color: "#4ECDC4", percentage: 20 },
  ]
}
