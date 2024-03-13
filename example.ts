import typia, { type tags } from "typia";
 
const res: typia.IValidation<IMember> = typia.validate<IMember>({
  id: 5, // wrong, must be string (uuid)
  age: 20.75, // wrong, not integer
  email: "danial@hambergerpls.com",
});
 
if (!res.success) console.log(res.errors);
 
interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number &
    tags.Type<"uint32"> &
    tags.ExclusiveMinimum<19> &
    tags.Maximum<100>;
}
