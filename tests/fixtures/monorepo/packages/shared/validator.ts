import typia from "typia";

export interface IMember {
    id: string;
    age: number;
}

export const isMember = (input: unknown) => typia.is<IMember>(input);
