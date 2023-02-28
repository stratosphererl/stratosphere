## Testing Guidelines

### How to use
0. Make sure you have `pytest` installed
1.  `cd` into the service directory if you haven't already
2.  In the terminal, run `pytest`

### Requirements
- Each layer of your service (e.g. database, service, and routers) should be tested. That means all methods should be tested to maximize code coverage.
- It is expected that alls tests are written to be compatible with pytest.
  - AKA:
    1. Tests are located in the `tests` directory
    2. Tests are suffixed with `_test`, in order for pytest to pick them up
    3. Tests are named to follow the following format (i.e. mixture of camel and snake case): `ClassToBeTested_<type of test>_test.py`
    4. Each method in the test scripts should be prefixed with `test` in snake case. For example, `test_this_method()`
    5. Reduce WET test code by using pytest fixtures.
    6. For database or integration tests, you need to provide the proper configurations/documentation in order to run the code. For example, providing .envs or stating that you need to have a container running at x port.





