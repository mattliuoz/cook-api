
const LambdaTester = require('lambda-tester');



describe('Create handler', () => {

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('should return a status code 200 and have the correct header', () => {
    //Arrange
    process.env.DYNAMODB_TABLE='test_table';
    const lambda = require('./create');
    console.log(process.env.DYNAMODB_TABLE);
    
    const eventbody = JSON.stringify({
      ingredients: "something",
      method: "cook how",
      duration: "1 hr",
      logo: "ahahahahah"
    });

    const testEvent = {
      body: eventbody

    };

    //Action
    return LambdaTester(lambda.handler)
      .event(testEvent)
      //Assert
      .expectSucceed((result) => {
        console.log(result);
        expect(result.statusCode).toBe(200);
        expect(result.headers).toHaveProperty('Content-Type');
      });
  });
});


