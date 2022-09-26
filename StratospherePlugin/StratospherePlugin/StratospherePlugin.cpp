#include "pch.h"
#include "StratospherePlugin.h"

using namespace std::filesystem;

BAKKESMOD_PLUGIN(StratospherePlugin, "write a plugin description here", plugin_version, PLUGINTYPE_FREEPLAY)

std::shared_ptr<CVarManagerWrapper> _globalCvarManager;

void StratospherePlugin::onLoad()
{
	_globalCvarManager = cvarManager;
	
	cvarManager->registerNotifier("upload_latest_replay", [this](std::vector<std::string> params) {
		char* userpath = getenv("USERPROFILE");
		if (userpath == NULL)
			return;
		std::string userPathString = std::string(userpath);

		path ReplaysDirectoryPath = path(userPathString + "\\Documents\\My\ Games\\Rocket\ League\\TAGame\\Demos");
		if (!is_directory(ReplaysDirectoryPath)) {
			ReplaysDirectoryPath = path(userPathString + "\\OneDrive\\Documents\\My\ Games\\Rocket\ League\\TAGame\\Demos");
			if (is_directory(ReplaysDirectoryPath))
				LOG("Directory Found!");
			else {
				LOG("Directory not found :(");
				return;
			}
		}
		else
			LOG("Directory found!");

		directory_iterator ReplaysDirectoryIterator(ReplaysDirectoryPath);
		if (!ReplaysDirectoryIterator->exists())
			return;
		const directory_entry* replayEntry = ReplaysDirectoryIterator.operator->();
		path replayFilePath = replayEntry->path();

		LOG(replayFilePath.c_str());

		LOG("Upload replay file here!");
		}, "uploads latest replay file", PERMISSION_ALL);
}

void StratospherePlugin::onUnload()
{
}