#include "pch.h"
#include "StratospherePlugin.h"

// Plugin Settings Window code here
std::string StratospherePlugin::GetPluginName() {
	return "StratospherePlugin";
}

// Render the plugin settings here
// This will show up in bakkesmod when the plugin is loaded at
//  f2 -> plugins -> StratospherePlugin
void StratospherePlugin::RenderSettings() {
	ImGui::TextUnformatted("Stratosphere plugin settings");

	// Checkbox to enable/disable overlay
	bool isEnabled = isWindowOpen_;
	if (ImGui::Checkbox("Enable/disabe overlay", &isEnabled))
		gameWrapper->Execute([this](GameWrapper* gw) {
			cvarManager->executeCommand("togglemenu " + GetMenuName());
		});
}

// Do ImGui rendering here
void StratospherePlugin::Render()
{
	// Open new menu with these flags
	ImGuiWindowFlags windowFlags = ImGuiWindowFlags_NoBackground | ImGuiWindowFlags_NoDecoration;
	if (!ImGui::Begin(menuTitle_.c_str(), &isWindowOpen_, windowFlags))
	{
		// Early out if the window is collapsed, as an optimization.
		ImGui::End();
		return;
	}

	// Button
	if (ImGui::Button("Upload Replay"))
		// Note: You must wrap certain actions in the gameWrapper->Execute() method otherwise it may crash
		gameWrapper->Execute([this](GameWrapper* gw) { 
			cvarManager->executeCommand("upload_latest_replay");
		});
	if (ImGui::IsItemHovered()) // Displays tooltip
		ImGui::SetTooltip("Uploads latest replay file!");

	ImGui::End();

	if (!isWindowOpen_) // This was just here, it doesn't seem to do anything
	{
		cvarManager->executeCommand("togglemenu " + GetMenuName());
	}
}

// Name of the menu that is used to toggle the window.
std::string StratospherePlugin::GetMenuName()
{
	return "StratospherePlugin";
}

// Title to give the menu
std::string StratospherePlugin::GetMenuTitle()
{
	return menuTitle_;
}

// Don't call this yourself, BM will call this function with a pointer to the current ImGui context
void StratospherePlugin::SetImGuiContext(uintptr_t ctx)
{
	ImGui::SetCurrentContext(reinterpret_cast<ImGuiContext*>(ctx));
}

// Should events such as mouse clicks/key inputs be blocked so they won't reach the game
bool StratospherePlugin::ShouldBlockInput()
{
	return ImGui::GetIO().WantCaptureMouse || ImGui::GetIO().WantCaptureKeyboard;
}

// Return true if window should be interactive
bool StratospherePlugin::IsActiveOverlay()
{
	return true;
}

// Called when window is opened
void StratospherePlugin::OnOpen()
{
	isWindowOpen_ = true;
}

// Called when window is closed
void StratospherePlugin::OnClose()
{
	isWindowOpen_ = false;
}
