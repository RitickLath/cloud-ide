import { registerAs } from "@nestjs/config";
import { Framework } from "src/common/types/project.types";

export default registerAs("frameworks", () => ({
    [Framework.NEXTJS]: process.env.CMD_NEXTJS,
    [Framework.REACT]: process.env.CMD_REACT,
    [Framework.NODEJS]: process.env.CMD_NODEJS,
    [Framework.PYTHON]: process.env.CMD_PYTHON,
    [Framework.FASTAPI]: process.env.CMD_FASTAPI,
    [Framework.NESTJS]: process.env.CMD_NESTJS,
}));
