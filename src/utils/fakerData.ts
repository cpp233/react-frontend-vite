// import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
import { fakerZH_CN } from '@faker-js/faker';
import logger from './logger';

// const faker = fakerJsfaker.faker;

// faker.setLocale('zh_CN');

export const getFakerData = (): NewItem => {
  // const fakerData = {
  //   // name: faker.name.findName(),
  //   name: faker.commerce.product(),
  //   tagList: [
  //     faker.commerce.productAdjective(),
  //     faker.commerce.productAdjective(),
  //     faker.commerce.productMaterial(),
  //   ] as string[],
  //   content: faker.commerce.productDescription(),
  //   isShow: faker.datatype.boolean(),
  //   quantity: faker.datatype.number({ min: 100, max: 200 }),
  // };

  const fakerData = {
    name: fakerZH_CN.commerce.product(),
    tagList2: fakerZH_CN.helpers.arrayElements(
      [
        fakerZH_CN.commerce.productAdjective(),
        fakerZH_CN.commerce.productAdjective(),
        fakerZH_CN.commerce.productMaterial(),
      ],
      { min: 0, max: 3 }
    ),
    content: fakerZH_CN.commerce.productDescription(),
    isShow: fakerZH_CN.datatype.boolean(),
    quantity: fakerZH_CN.number.int({ min: 100, max: 200 }),
  };

  // logger.trace(fakerData);

  return fakerData;
};
