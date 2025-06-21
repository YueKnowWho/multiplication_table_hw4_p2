/*
File: mult_table.js
GUI Assignment: Multiplication Table
Jonathan Yue, UMass Lowell Computer Science, jonathan_yue@student.uml.edu
Copyright (c) 2025 by Jonathan Yue All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.
updated by JY on June 20, 2025 at 8 PM
*/
class MultiplicationTable{
    constructor(col_min, col_max, row_min, row_max){
        this.col_min = col_min;
        this.col_max = col_max;
        this.row_min = row_min;
        this.row_max = row_max;
    }
    generate(){
        const table = document.createElement('table');
        table.className = 'table table-light table-bordered';

        //header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th')); // empty corner
        for(let col = this.col_min; col <= this.col_max; col++) {
            //adds col min and max headers
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        }
        //adds header row to thead and thead to table
        thead.appendChild(headerRow);
        table.appendChild(thead);

        //body rows
        const tbody = document.createElement('tbody');
        for(let row = this.row_min; row <= this.row_max; row++) {
            //adds row min and max headers
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = row;
            tr.appendChild(th);
            //adds products
            for(let col = this.col_min; col <= this.col_max; col++) {
                const td = document.createElement('td');
                td.textContent = row * col;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        return table;
    }
}
//create initial table
window.addEventListener('DOMContentLoaded', function() {
    const colMin = parseInt($('#col_min').val());
    const colMax = parseInt($('#col_max').val());
    const rowMin = parseInt($('#row_min').val());
    const rowMax = parseInt($('#row_max').val());
    //only add if there isn't already a table
    if ($('#mult-table').length === 0) {
        const initialTable = new MultiplicationTable(colMin, colMax, rowMin, rowMax);
        const tableElement = initialTable.generate();
        tableElement.id = 'mult-table';
        $('.table-container').append(tableElement)
    }
});
//validate table form
jQuery.validator.addMethod("greaterThanOrEqualTo", function(value, element, param) {
    return this.optional(element) || Number(value) >= Number($(param).val());
});
jQuery.validator.addMethod("lessThanOrEqualTo", function(value, element, param) {
    return this.optional(element) || Number(value) <= Number($(param).val());
});
$('#col_min, #col_max').on('input change', function() {
    $('#col_min').valid();
    $('#col_max').valid();
});
$('#row_min, #row_max').on('input change', function() {
    $('#row_min').valid();
    $('#row_max').valid();
});
$("form#table-form").validate({
    rules: {
        col_min:{
            required: true,
            number:true,
            step:1,
            min: -50,
            max: 50,
            lessThanOrEqualTo: "#col_max"
        },
        col_max: {
            required: true,
            number:true,
            step:1,
            min: -50,
            max: 50,
            greaterThanOrEqualTo: "#col_min"
        },
        row_min: {
            required: true,
            number:true,
            step:1,
            min: -50,
            max: 50,
            lessThanOrEqualTo: "#row_max"
        },
        row_max: {
            required: true,
            number:true,
            step:1,
            min: -50,
            max: 50,
            greaterThanOrEqualTo: "#row_min"
        }
    },
    messages:{
        col_min: {
            required: "This field is required",
            step: "Please enter an integer value",
            min: "Minimum value is -50",
            max: "Maximum value is 50",
            lessThanOrEqualTo: "Minimum column value must be less than or equal to maximum column value"
            
        },
        col_max: {
            required: "This field is required",
            step: "Please enter an integer value",
            min: "Minimum value is -50",
            max: "Maximum value is 50",
            greaterThanOrEqualTo: "Maximum column value must be greater than or equal to minimum column value"
        },
        row_min: {
            required: "This field is required",
            step: "Please enter an integer value",
            min: "Minimum value is -50",
            max: "Maximum value is 50",
            lessThanOrEqualTo: "Minimum row value must be less than or equal to maximum row value"
        },
        row_max: {
            required: "This field is required",
            step: "Please enter an integer value",
            min: "Minimum value is -50",
            max: "Maximum value is 50",
            greaterThanOrEqualTo: "Maximum row value must be greater than or equal to minimum row value"
        }
    },
    errorPlacement: function(error, element) {
        const sliderDiv = element.next('.ui-slider');
        if (sliderDiv.length) {
            error.insertAfter(sliderDiv);
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler: function(form) {
        handleTableSubmit();
    }
});

function updateTable(){
    const colMin = parseInt($('#col_min').val());
    const colMax = parseInt($('#col_max').val());
    const rowMin = parseInt($('#row_min').val());
    const rowMax = parseInt($('#row_max').val());

    $('#mult-table').remove();

    const table = new MultiplicationTable(colMin, colMax, rowMin, rowMax);
    const tableElement = table.generate();
    tableElement.id = 'mult-table';
    $('#main-table').append(tableElement);
}
//setup slider
$(function() {
    //slider settings
    const sliderSettings = {
        min: -50,
        max: 50,
        step: 1
    };

    //helper to sync slider and input
    function setupSlider(inputId, sliderId) {
        //initialize slider
        $(sliderId).slider({
            ...sliderSettings,
            value: Number($(inputId).val()) || 0,
            slide: function(event, ui) {
                $(inputId).val(ui.value).trigger('input');
            }
        });
        //when input changes, update slider
        $(inputId).on('input', function() {
            let val = Number(this.value);
            if (!isNaN(val)) {
                $(sliderId).slider('value', val);
            }
        });
    }

    setupSlider('#col_min', '#col_min_slider');
    setupSlider('#col_max', '#col_max_slider');
    setupSlider('#row_min', '#row_min_slider');
    setupSlider('#row_max', '#row_max_slider');
});
//update table dynamically
$('#col_min, #col_max, #row_min, #row_max').on('input change', function() {
    if ($("#table-form").valid()) {
        updateTable();
    }
});
//set up tabs
$(function() {
    $("#saved-tabs").tabs();
});

let tabCount = 0;

function handleTableSubmit() {
    const colMin = parseInt($('#col_min').val());
    const colMax = parseInt($('#col_max').val());
    const rowMin = parseInt($('#row_min').val());
    const rowMax = parseInt($('#row_max').val());

    //generate a new table for the tab
    const table = new MultiplicationTable(colMin, colMax, rowMin, rowMax);
    const tableElement = table.generate();
    tableElement.classList.add("tab");
    //create a unique tab id and label
    tabCount++;
    const tabId = "tab-" + tabCount;
    const tabLabel = `Cols: [${colMin},${colMax}] Rows: [${rowMin},${rowMax}]`;
    //add new tab header and panel
    $("#saved-tabs ul").append(
        `<li>
        <input type="checkbox" class="tab-select-checkbox" style="margin-right:4px;">
        <a href="#${tabId}">${tabLabel}</a>
        <span class="ui-icon ui-icon-close" role="presentation"></span>
        </li>`
    );
    $("#saved-tabs").append(
        `<div id="${tabId}"></div>`
    );
    //clone the table for the tab (no id)
    $(`#${tabId}`).append(
        $('<div class="table-container"></div>').append(
            $(tableElement).clone().removeAttr('id')
        )
    );
    $("#saved-tabs").tabs("refresh");
    // switch to the new tab
    const newIndex = $("#saved-tabs ul li").length - 1;
    $("#saved-tabs").tabs("option", "active", newIndex);
}

//enable closing tabs
$(document).on("click", "#saved-tabs .ui-icon-close", function() {
    const panelId = $(this).closest("li").remove().attr("aria-controls");
    $("#" + panelId).remove();
    $("#saved-tabs").tabs("refresh");
});
//enables deleting tabs
$('#delete-selected-tabs').on('click', function() {
    // Find all checked checkboxes in tab headers
    $('#saved-tabs ul .tab-select-checkbox:checked').each(function() {
        const $li = $(this).closest('li');
        const panelId = $li.attr('aria-controls');
        $li.remove();
        $('#' + panelId).remove();
    });
    $("#saved-tabs").tabs("refresh");
});