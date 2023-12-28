import { appDataSource } from "@/dataSource";
import { runSeeders } from "typeorm-extension";

appDataSource.initialize().then(async () => {
    await appDataSource.synchronize(true);
    await runSeeders(appDataSource);
    process.exit()
})
