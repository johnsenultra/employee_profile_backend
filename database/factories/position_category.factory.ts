import { define } from "typeorm-seeding";
import Faker from "faker";
import { PositionCategory } from '../entities/position_category.entity';

define(PositionCategory, (faker: Faker) => {
   const category = new PositionCategory();
   category.categoryName = faker.random.arrayElement(["Faculty", "Non-Teaching Staff"]);
   return category;
});