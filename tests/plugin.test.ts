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

test("should be able to use random function", async () => {    
    const input: IMember = typia.random<IMember>();

    expect(typia.validate<IMember>(input).success).toEqual(true);    
  });

test("should be able to use assert function", async () => {    
    const input: IMember = typia.random<IMember>();

    expect(() => typia.assert<IMember>(input)).not.toThrow();
    expect(typia.validate<IMember>(input).success).toEqual(true);
  });