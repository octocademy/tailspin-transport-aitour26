-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shortTagline" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "range" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL DEFAULT '',
    "topSpeed" TEXT NOT NULL DEFAULT '',
    "acceleration" TEXT NOT NULL DEFAULT '',
    "power" TEXT NOT NULL DEFAULT '',
    "drivetrain" TEXT NOT NULL DEFAULT '',
    "seats" INTEGER NOT NULL DEFAULT 5,
    "battery" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Vehicle" ("category", "createdAt", "id", "imageUrl", "isFeatured", "name", "price", "range", "shortTagline", "slug", "updatedAt") SELECT "category", "createdAt", "id", "imageUrl", "isFeatured", "name", "price", "range", "shortTagline", "slug", "updatedAt" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
