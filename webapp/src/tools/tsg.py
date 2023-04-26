import numpy as np

"""
Acronym TSG == "Text Shadow Generator"

This file, when called, will generate CSS code to .//tsg.txt for a smooth text-shadow based on parameters provided

@param color_war --> String of the color or color variable to be used (ex. "#f1f1f1" or "var(--chill-blue)")
@param max_pixel_width --> The maximum width the text shadow should reach
@param num_steps --> How many steps in the range from 0 to max_pixel_width to take; all steps are equal
"""

def generate_text_shadow_css(color_var, max_pixel_width, num_steps):
    text_file = open(".//tsg.txt", "w")

    curr_iteration = 1

    curr_iteration = helper(text_file, color_var, max_pixel_width, num_steps, [1,1], curr_iteration)
    curr_iteration = helper(text_file, color_var, max_pixel_width, num_steps, [-1,1], curr_iteration)
    curr_iteration = helper(text_file, color_var, max_pixel_width, num_steps, [-1,-1], curr_iteration)
    curr_iteration = helper(text_file, color_var, max_pixel_width, num_steps, [1,-1], curr_iteration)

    text_file.close()

def helper(text_file, color_var, max_pixel_width, num_steps, signs, curr_iteration_value):
    curr_iteration = curr_iteration_value

    for pixel_width in np.linspace(0, max_pixel_width, num_steps):
        text_file.write(color_var + " " + str((max_pixel_width - pixel_width) * signs[0]) + "px " + str((0 + pixel_width) * signs[1]) + "px 0px")

        if curr_iteration != num_steps * 4:
            text_file.write(",\n")
        elif curr_iteration == num_steps * 4:
            text_file.write(";")

        curr_iteration += 1

    return curr_iteration
    
generate_text_shadow_css("var(--sky-blue)", 3, 14)