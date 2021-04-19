export function classes_intersect(class1, class2) {
  function intersects(start1, start2, end1, end2) {
    if (start1 == null || start2 == null || end1 == null || end2 == null) return false;
    return start1 <= end2 && end1 >= start2;
  }

  let same_day = false;

  if (class1["days"] != null && class2["days"] != null) {
    for (let letter of class1["days"]) {
      if (class2["days"] != null && class2["days"].indexOf(letter) !== -1) {
        same_day = true;
        break;
      }
    }
  }

  if (!same_day) return false;

  if (!intersects(class1["start_date"], class2["start_date"], class1["end_date"], class2["end_date"])) {
    return false;
  }

  if (intersects(class1["start_time"], class2["start_time"], class1["end_time"], class2["end_time"])) {
    return true;
  }
}