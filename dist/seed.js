"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
var db_1 = require("./db");
var schema_1 = require("@shared/schema");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, sampleUsers, sampleMasters, sampleServices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Seeding database...");
                    return [4 /*yield*/, db_1.db.insert(schema_1.serviceCategories).values([
                            {
                                name: "Сантехніка",
                                description: "Усунення протікань, встановлення труб, ремонт",
                                icon: "fas fa-wrench",
                                color: "blue",
                                basePrice: "300",
                            },
                            {
                                name: "Електрика",
                                description: "Проводка, розетки, освітлення, електромонтаж",
                                icon: "fas fa-bolt",
                                color: "yellow",
                                basePrice: "400",
                            },
                            {
                                name: "Прибирання",
                                description: "Генеральне прибирання, після ремонту, регулярне",
                                icon: "fas fa-broom",
                                color: "green",
                                basePrice: "200",
                            },
                            {
                                name: "Ремонт",
                                description: "Оздоблювальні роботи, фарбування, плитка",
                                icon: "fas fa-paint-roller",
                                color: "purple",
                                basePrice: "500",
                            },
                            {
                                name: "Побутова техніка",
                                description: "Ремонт пральних машин, холодільників, плит",
                                icon: "fas fa-cog",
                                color: "red",
                                basePrice: "350",
                            },
                            {
                                name: "Меблі",
                                description: "Збирання, ремонт, перетяжка меблів",
                                icon: "fas fa-couch",
                                color: "indigo",
                                basePrice: "250",
                            },
                        ]).returning()];
                case 1:
                    categories = _a.sent();
                    console.log("\u2705 Created ".concat(categories.length, " service categories"));
                    return [4 /*yield*/, db_1.db.insert(schema_1.users).values([
                            {
                                username: "oleksandr_plumber",
                                email: "oleksandr@example.com",
                                password: "hashedpassword1",
                                firstName: "Олександр",
                                lastName: "Петренко",
                                phone: "+380671234567",
                                userType: "master",
                            },
                            {
                                username: "maria_electrician",
                                email: "maria@example.com",
                                password: "hashedpassword2",
                                firstName: "Марія",
                                lastName: "Іваненко",
                                phone: "+380671234568",
                                userType: "master",
                            },
                            {
                                username: "ivan_cleaner",
                                email: "ivan@example.com",
                                password: "hashedpassword3",
                                firstName: "Іван",
                                lastName: "Коваленко",
                                phone: "+380671234569",
                                userType: "master",
                            },
                        ]).returning()];
                case 2:
                    sampleUsers = _a.sent();
                    console.log("\u2705 Created ".concat(sampleUsers.length, " sample users"));
                    return [4 /*yield*/, db_1.db.insert(schema_1.masters).values([
                            {
                                userId: sampleUsers[0].id,
                                specialization: "Сантехнік",
                                description: "Професійний сантехнік з 15-річним досвідом роботи. Спеціалізуюся на усуненні протікань, встановленні та ремонті сантехнічного обладнання.",
                                experience: "15 років досвіду",
                                hourlyRate: "300",
                                rating: "5.0",
                                reviewCount: 127,
                                isVerified: true,
                                completedJobs: 1247,
                                responseTime: "< 15 хв",
                                repeatClients: 94,
                            },
                            {
                                userId: sampleUsers[1].id,
                                specialization: "Електрик",
                                description: "Сертифікований електрик. Проводка, освітлення, розетки. Гарантія на роботи.",
                                experience: "8 років досвіду",
                                hourlyRate: "400",
                                rating: "4.8",
                                reviewCount: 89,
                                isVerified: true,
                                completedJobs: 456,
                                responseTime: "< 20 хв",
                                repeatClients: 87,
                            },
                            {
                                userId: sampleUsers[2].id,
                                specialization: "Клінінг",
                                description: "Професійне прибирання офісів та квартир. Екологічні засоби. Команда до 5 осіб.",
                                experience: "6 років досвіду",
                                hourlyRate: "200",
                                rating: "4.9",
                                reviewCount: 156,
                                isVerified: true,
                                completedJobs: 789,
                                responseTime: "< 25 хв",
                                repeatClients: 91,
                            },
                        ]).returning()];
                case 3:
                    sampleMasters = _a.sent();
                    console.log("\u2705 Created ".concat(sampleMasters.length, " sample masters"));
                    return [4 /*yield*/, db_1.db.insert(schema_1.services).values([
                            {
                                masterId: sampleMasters[0].id,
                                categoryId: categories[0].id,
                                name: "Усунення протікань",
                                description: "Крани, змішувачі, з'єднання труб",
                                price: "300",
                            },
                            {
                                masterId: sampleMasters[1].id,
                                categoryId: categories[1].id,
                                name: "Встановлення розеток",
                                description: "Проводка та встановлення електророзеток",
                                price: "400",
                            },
                            {
                                masterId: sampleMasters[2].id,
                                categoryId: categories[2].id,
                                name: "Генеральне прибирання",
                                description: "Повне прибирання квартири або офісу",
                                price: "200",
                            },
                        ]).returning()];
                case 4:
                    sampleServices = _a.sent();
                    console.log("\u2705 Created ".concat(sampleServices.length, " sample services"));
                    console.log("🎉 Database seeding completed!");
                    return [2 /*return*/];
            }
        });
    });
}
// Run seeding
seedDatabase()
    .then(function () {
    console.log("Seeding finished successfully");
    process.exit(0);
})
    .catch(function (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
});
