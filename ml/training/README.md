# Training

## About

This folder contains two important scripts:

`CreateDatasets.py` takes replay files from the `replays` directory and filters out the replays that either can't be parsed or are not attributed to a model we care about. Then it takes `10%` of the frames out of each replay and distributes them to the relevent csv files. Please note that the data is not normalized at this step and that no `nan` values are removed.

`TrainModels.py` is responsible for taking the datasets produced from `CreateDatasets.py` and training the actual ml models. In this process, the datasets are cleaned (replacing `nan` values with appropriate placeholders) and normalized to the specifications of Rocket Leagues game restrictions (e.g. field constraints, maximum player velocity, etc.).

---

## Usage

### __Setup__

The working directory for all scripts in this folder should be `C:\...\ml\training`

Make sure you have the python environment manager `pipenv` installed. This manages the scripts dependencies:

```
pip install pipenv
```

Now you must install all of the dependencies for our scripts. `pipenv` makes this very straight forward:

```
pipenv install
```

_note: Your terminal may or may not throw an error when running this. If you have any issues, simply run the terminal with administrative privileges. This has to do with the `.whl` file that is used to install carball (but I won't get into that here)._

Then you can enter the pipenv shell, this will make it so your console is in the activated virtual environment:

```
pipenv shell
```

Alternatively you can run scripts without activating the virtual environment in your terminal with:

```
pipenv run [command]
```

### __Adding Replays__

You can add your replays to the file: `~\replays`

_note: Your working directory should be `C:\...\training` but this is overall dependent on where you are running the python scripts from._

_another note: The `CreateDatasets.py` script is dependent on the replay parser/analasis tool `Carball`. This means this script will not use any replays that cannot be parsed by `Carball`_

_a third note: Any replays that are not of the proper game mode will be ignored. "Proper" Game Modes: `Ranked Duels`, `Duels`, `Ranked Doubles`, `Doubles`, `Ranked Standard`, and `Standard`_

_a final note (I swear): For simplicity, replays that include bots will also be ignored._

### __Creating the Datasets__

As mentioned in the about section, we create our datasets using the `CreateDatasets.py` script. Firstly, make sure you have all the replays that are going to be used in the `replays` directory mentioned above.

Make sure to run this script while in the pipenv shell and in the appropriate working directory:

```
pipenv shell
python CreateDatasets.py
```

or

```
pipenv run python CreateDatasets.py
```

Creating the datasets will take a while as each replay needs to be parsed wich may take 20-40 seconds per replay. When it finishes, you will find your datasets created and in the `datasets` folder in your current working directory.

### __Training the Models__

Given you have created your datasets and they are located in the `datasets` directory, you can now train your models. Run the script `TrainModels.py` using the same method(s) as shown before:

```
pipenv shell
python TrainModels.py
```

or

```
pipenv run python TrainModels.py
```

This process will take a long time, depending on the number of replays you are training your data on. For me, it took `31.883 minutes` to train the models on roughly `180 replays`.

You can find your models in the `models` directory. There will be two models per dataset, both trained on different columns of data.