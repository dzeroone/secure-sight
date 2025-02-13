export function updateNestedField(obj: any, path: string, value: any): any {
    const keys = path.split(".");
    let newObj = { ...obj }; // Start with a shallow copy of the input object
    let current = newObj;

    // Iterate over the keys, but stop at the second-to-last key
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the current level does not have the key, create an empty object
        if (!(key in current)) {
            current[key] = {};
        }
        // Move deeper into the object, creating shallow copies as needed
        current[key] = { ...current[key] };
        current = current[key];
    }

    // Update the final key with the new value
    current[keys[keys.length - 1]] = value;

    return newObj;
}