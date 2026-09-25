import { isMember } from "../shared/validator";

console.log(
    JSON.stringify({
        valid: isMember({ id: "a", age: 1 }),
        invalid: isMember({ id: 5 }),
    }),
);
