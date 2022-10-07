#include "pch.h"
#include "StratospherePlugin.h"

using namespace std::filesystem;

BAKKESMOD_PLUGIN(StratospherePlugin, "write a plugin description here", plugin_version, PLUGINTYPE_FREEPLAY)

std::shared_ptr<CVarManagerWrapper> _globalCvarManager;

void StratospherePlugin::onLoad()
{
	_globalCvarManager = cvarManager;
	
	// Defines executable command upload_latest_replay
	cvarManager->registerNotifier("upload_latest_replay", [this](std::vector<std::string> params) {
		// Make sure to get path to user (aka %userprofile%\)
		char* userpath = getenv("USERPROFILE");
		if (userpath == NULL)
			return;
		std::string userPathString = std::string(userpath);

		// Default path
		path ReplaysDirectoryPath = path(userPathString + "\\Documents\\My\ Games\\Rocket\ League\\TAGame\\Demos");
		if (!is_directory(ReplaysDirectoryPath)) {
			// My games dumb and uses this path
			ReplaysDirectoryPath = path(userPathString + "/OneDrive/Documents/My Games/Rocket League/TAGame/Demos");
			if (is_directory(ReplaysDirectoryPath))
				LOG("Directory Found!");
			else {
				LOG("Directory not found :(");
				return;
			}
		}
		else
			LOG("Directory found!");

		// Use an iterator to access everything in the directory
		directory_iterator ReplaysDirectoryIterator(ReplaysDirectoryPath);
		if (!ReplaysDirectoryIterator->exists())
			return;
		const directory_entry* replayEntry = ReplaysDirectoryIterator.operator->();
		path replayFilePath = replayEntry->path(); // Get just the first one

		LOG(ReplaysDirectoryPath.c_str());
		LOG(replayFilePath.c_str());

		LOG("Upload replay file here!");
		}, "uploads latest replay file", PERMISSION_ALL);
}

void StratospherePlugin::onUnload()
{
}