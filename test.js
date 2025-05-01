const pairs = [
  ['name', 'John'],
  ['age', 0],
  ['address.street', 'street'],
  ['address.country.name', 'england'],
  ['address.country.acronym', 'UK'],
];
function test() {
  const x = insertKeyValuesToObject(pairs);
  console.log(x);
}
function insertKeyValuesToObject(keyValueArray, object = {}) {
  keyValueArray.forEach(([key, value]) => {
    const parts = key.trim().split('.');
    let current = object;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = value; // Set final value
      } else {
        if (!current[part] || typeof current[part] !== 'object')
          current[part] = {};
        current = current[part]; // Move deeper
      }
    });
  });

  return object;
}

test();
/* eslint-disable capitalized-comments */
// const pairs = [
//   ['name', 'John'],
//   ['age', 0],
//   ['address.street', 'street'],
//   ['address.country', 'england'],
// ];

// function insertKeyValuesToObject(keyValueArray, object = {}) {
//   keyValueArray.forEach(([k, v]) => {
//     k = k.trim();
//     const keySplit = k.split('.');
//     const keySplitLength = keySplit.length;
//     if (keySplitLength > 1) {
//       let temp = {};
//       const last = keySplit.pop();
//       let path = '';
//       const x = keySplit.reduce(
//         (previous, current) => {
//           console.log({ previous, current });
//           temp[current] = previous;
//           console.log({ path });
//           path = `${current}${path.length > 0 ? `.${path}` : ``}`;
//           console.log({ path });
//           return temp;
//         },
//         { [last]: v },
//       );
//       console.log({ x, temp, last });
//       object = { ...object, ...x };
//     } else {
//       object[k] = v;
//     }
//   });

//   return object;
// }

// console.log(
//   insertKeyValuesToObject(pairs, {
//     key: 'SomeValue',
//     address: { city: 'Shef' },
//   }),
// );
