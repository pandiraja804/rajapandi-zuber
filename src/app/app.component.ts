import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  filteredElements: any
  availableElements2: any;
  ngOnInit(): void {

    this.availableElements2 = this.availableElements1

  }
  fieldGroups = JSON.parse(localStorage.getItem('fieldGroups') || '[]');


  availableElements = [

    { type: 'text', label: 'Single Line Text', icon: 'short_text' },
    { type: 'textarea', label: 'Multi-Line Text', icon: 'notes' },
    { type: 'number', label: 'Number Input', icon: 'looks_one' },

    { type: 'date', label: 'Date Picker', icon: 'event' },
    { type: 'time', label: 'Time Picker', icon: 'schedule' },
    { type: 'datetime-local', label: 'Date & Time Picker', icon: 'calendar_today' },


    { type: 'dropdown', label: 'Dropdown', icon: 'arrow_drop_down_circle' },
    { type: 'radio', label: 'Single Selection', icon: 'radio_button_checked', options: [  { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }] },
    { type: 'checkbox', label: 'Multi Selection', icon: 'check_box', options: [{ label: 'Check 1', value: 'check1' },
      { label: 'Check 2', value: 'check2' },
      { label: 'Check 3', value: 'check3' }] },


    { type: 'file', label: 'Upload Field', icon: 'upload_file' }
  ];

  availableElements1 = [
    {
      type: 'heading',
      label: 'TEXT',
      elements: [
        { type: 'text', label: 'Single Line Text', icon: 'short_text' },
        { type: 'textarea', label: 'Multi-Line Text', icon: 'notes' },
        { type: 'number', label: 'Number Input', icon: 'looks_one' },
      ]
    },
    {
      type: 'heading',
      label: 'DATE',
      elements: [
        { type: 'date', label: 'Date Picker', icon: 'event' },
        { type: 'time', label: 'Time Picker', icon: 'schedule' },
        { type: 'datetime-local', label: 'Date & Time Picker', icon: 'calendar_today' },
      ]
    },
    {
      type: 'heading',
      label: 'MULTI',
      elements: [
        { type: 'dropdown', label: 'Dropdown', icon: 'arrow_drop_down_circle' },
        { type: 'radio', label: 'Single Selection', icon: 'radio_button_checked', options: [ { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }] },
        { type: 'checkbox', label: 'Multi Selection', icon: 'check_box', options: [{ label: 'Check 1', value: 'check1' },
          { label: 'Check 2', value: 'check2' },
          { label: 'Check 3', value: 'check3' }] },
      ]
    },
    {
      type: 'heading',
      label: 'MEDIA',
      elements: [
        { type: 'file', label: 'Upload Field', icon: 'upload_file' }
      ]
    }
  ];

  selectedGroup: any = null;
  selectedElement: any = null;
  isModalOpen = false;
  isElementModalOpen = false;
  newGroupName = '';
  newGroupDescription = '';
  searchText: string = '';
  isEditModalOpen = false;
  editGroupName = '';
  editGroupDescription = '';
  editingGroup: any = null;


  selectGroup(group: any) {
    this.selectedGroup = group;
  }


  addFieldGroup() {
    if (this.newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: this.newGroupName,
        description: this.newGroupDescription,
        elements: [],
      };
      this.fieldGroups.push(newGroup);
      this.saveToLocalStorage();
      this.isModalOpen = false;
      this.newGroupName = '';
      this.newGroupDescription = '';
    }
  }

  editFieldGroup(group: any) {
    this.editingGroup = group;
    this.editGroupName = group.name;
    this.editGroupDescription = group.description;
    this.isEditModalOpen = true;
  }

  updateFieldGroup() {
    if (this.editingGroup) {
      this.editingGroup.name = this.editGroupName;
      this.editingGroup.description = this.editGroupDescription;
      this.saveToLocalStorage();
      this.isEditModalOpen = false;
    }
  }

  deleteFieldGroup(id: number) {
    this.fieldGroups = this.fieldGroups.filter(
      (group: { id: number }) => group.id !== id
    );
    if (this.selectedGroup?.id === id) {
      this.selectedGroup = null;
    }
    this.saveToLocalStorage();
  }


  removeElement(index: number) {
    this.selectedGroup.elements.splice(index, 1);
    this.saveToLocalStorage();
  }


  editElement(element: any) {
    this.selectedElement = { ...element };
    this.isElementModalOpen = true;
  }


  saveElement() {
    const index = this.selectedGroup.elements.findIndex(
      (e: { id: any }) => e.id === this.selectedElement.id
    );
    if (index !== -1) {
      this.selectedGroup.elements[index] = this.selectedElement;
      this.saveToLocalStorage();
    }
    this.isElementModalOpen = false;
  }


  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.saveToLocalStorage();
    } else {

      if (this.selectedGroup) {
        const newElement = {
          id: Date.now(),
          ...event.previousContainer.data[event.previousIndex],
          placeholder: '',
          required: false,
        };
        this.selectedGroup.elements.splice(event.currentIndex, 0, newElement);
        this.saveToLocalStorage();

      }
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('fieldGroups', JSON.stringify(this.fieldGroups));
  }


  getInputClass(type: string): string {
    switch (type) {
      case 'text':
        return 'h-10';
      case 'textarea':
        return 'h-20';
      case 'date':
      case 'time':
      case 'datetime':
        return 'h-10 w-40';
      case 'number':
        return 'h-10 ';
      case 'checkbox':
      case 'radio':
        return 'w-6 h-6';
      case 'dropdown':
        return 'h-10 w-full';
      case 'file':
        return 'h-10';
      default:
        return 'h-10';
    }
  }

  getInputStyle(type: string): object {
    switch (type) {
      case 'textarea':
        return { resize: 'vertical' };
      case 'number':
        return { width: 'full' };
      case 'checkbox':
      case 'radio':
        return { width: '20px', height: '20px' };
      case 'file':
        return { padding: '5px' };
      default:
        return {};
    }
  }

  dropGroup(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.fieldGroups, event.previousIndex, event.currentIndex);
  }



  onSearchChange() {
    if (!this.searchText.trim()) {
      this.availableElements2 = this.availableElements1; 
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.availableElements2 = this.availableElements1
      .map(category => ({
        ...category,
        elements: category.elements.filter(element => element.label.toLowerCase().includes(searchLower))
      }))
      .filter(category => category.elements.length); 
  }

  copyElement(element: any) {
    if (this.selectedGroup) {
      const copiedElement = { ...element, id: Date.now() }; 
      this.selectedGroup.elements.push(copiedElement); 
      this.saveToLocalStorage(); 
    }
  }

  copyFieldGroup(group: any) {
    const copiedGroup = {
      ...group, 
      id: Date.now(), 
      name: group.name + ' (Copy)', 
      elements: group.elements.map((element: any) => ({ ...element, id: Date.now() })) 
    };

    this.fieldGroups.push(copiedGroup);
    this.saveToLocalStorage(); 
  }



}
