import { DataSource } from "typeorm";
import { appDBConnect } from "@/config";

export const appDataSource = new DataSource(appDBConnect);