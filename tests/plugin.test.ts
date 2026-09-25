import { test, expect } from "bun:test";
import typia, { type tags } from "typia";

   
  interface IMember {
    id: string & tags.Format<"uuid">;
    email: string & tags.Format<"email">;
    age: number &
      tags.Type<"uint32"> &
      tags.ExclusiveMinimum<19> &
      tags.Maximum<100>;
  }
  
test("should be able to use validate function", async () => {
    const res: typia.IValidation<IMember> = typia.validate<IMember>({
        id: 5, // wrong, must be string (uuid)
        age: 20.75, // wrong, not integer
        email: "danial@hambergerpls.com",
      });
    
    
    expect(res.success).toEqual(false);
    expect(res.errors).toEqual([
        {
          path: "$input.id",
          expected: "(string & Format<\"uuid\">)",
          value: 5,
        }, {
          path: "$input.age",
          expected: "number & Type<\"uint32\">",
          value: 20.75,
        }
      ]);
  });

test("should be able to use validateEquals function", async () => {
    const res: typia.IValidation<IMember> = typia.validateEquals<IMember>({
        id: 5, // wrong, must be string (uuid)
        age: 20.75, // wrong, not integer
        email: "danial@hambergerpls.com",
      });
    
    
    expect(res.success).toEqual(false);
    expect(res.errors).toEqual([
        {
          path: "$input.id",
          expected: "(string & Format<\"uuid\">)",
          value: 5,
        }, {
          path: "$input.age",
          expected: "number & Type<\"uint32\">",
          value: 20.75,
        }
      ]);
  });

// typia.random ignores ExclusiveMinimum in some versions, so the random tests
// use a type without it.
interface IRandomMember {
    id: string & tags.Format<"uuid">;
    email: string & tags.Format<"email">;
    age: number & tags.Type<"uint32"> & tags.Minimum<20> & tags.Maximum<100>;
}

test("should be able to use random function", async () => {
    for (let i = 0; i < 2000; i++) {
        const input: IRandomMember = typia.random<IRandomMember>();

        expect(typia.validate<IRandomMember>(input).success).toEqual(true);
    }
});

test("should be able to use assert function", async () => {
    for (let i = 0; i < 2000; i++) {
        const input: IRandomMember = typia.random<IRandomMember>();

        expect(() => typia.assert<IRandomMember>(input)).not.toThrow();
    }

    expect(() => typia.assert<IMember>({ id: 5, age: 20.75, email: "a@b.com" })).toThrow();
});