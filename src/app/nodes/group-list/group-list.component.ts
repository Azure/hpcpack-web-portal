import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSidenavContainer, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { ColumnDef } from 'src/app/shared-components/column-selector/column-selector.component';
import { NodeGroup } from 'src/app/api-client';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { MesssageService } from 'src/app/services/messsage.service';
import { NodeGroupOptions } from 'src/app/models/user-options';
import { oneAfterAnother } from 'src/app/utils/looper';
import { GroupEditorComponent } from '../group-editor/group-editor.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = [
    { name: 'Name', label: 'Name' },
    { name: 'Description', label: 'Description' },
    { name: 'Managed', label: 'Managed' },
  ]

  displayedColumns: string[] = ['Select', 'Name', 'Description', 'Managed'];

  dataSource: MatTableDataSource<NodeGroup> = new MatTableDataSource();

  selection = new SelectionModel<NodeGroup>(true);

  isLoading: boolean = false;

  private userOptions: NodeGroupOptions;

  @ViewChild(MatSidenavContainer, { static: true })
  private sidenavContainer: MatSidenavContainer;

  @ViewChild(MatSort, { static: true })
  private sort: MatSort;

  constructor(
    private mediaQuery: MediaQueryService,
    private api: ApiService,
    private userService: UserService,
    private messsageService: MesssageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (!this.userService.userOptions.nodeGroupOptions) {
      this.userService.userOptions.nodeGroupOptions = {}
    }
    this.userOptions = this.userService.userOptions.nodeGroupOptions;
    this.dataSource.sort = this.sort;
    this.loadData();
  }

  ngOnDestroy(): void {
  }

  private loadData(): void {
    this.isLoading = true;
    this.api.getNodeGroups().subscribe(data => {
      this.isLoading = false;
      this.dataSource.data = data;
    })
  }

  refresh(): void {
    this.loadData();
  }

  getErrorDetails(error: any): string {
    let result: string;
    try {
      let msg: string = error.error.Message;
      let match = msg.match(/Exception:\s*(.*)/i);
      result = match[1];
    }
    catch {
      console.error(error);
    }
    return result;
  }

  newGroup(): void {
    let dialogRef = this.dialog.open(GroupEditorComponent);
    dialogRef.afterClosed().subscribe((result: NodeGroup) => {
      if (!result) {
        return;
      }
      this.api.createNodeGroup(null, result).subscribe(
        group => {
          //NOTE: Simply this.dataSource.data.push(group) doesn't update UI.
          let groups = this.dataSource.data.concat([group]);
          this.dataSource.data = groups;
        },
        error => {
          let errMsg = `Failed creating group "${result.Name}"! ${this.getErrorDetails(error)}`;
          this.messsageService.showError(errMsg);
        }
      );
    });
  }

  editGroup(): void {
    let group = this.selection.selected[0];
    let dialogRef = this.dialog.open(GroupEditorComponent, { data: group });
    dialogRef.afterClosed().subscribe((result: NodeGroup) => {
      if (!result) {
        return;
      }
      this.api.updateNodeGroup(group.Name, null, result).subscribe(
        update => {
          group.Name = update.Name;
          group.Description = update.Description;
        },
        error => {
          let errMsg = `Failed editing group "${result.Name}"! ${this.getErrorDetails(error)}`;
          this.messsageService.showError(errMsg);
        }
      )
    });
  }

  deleteGroups(): void {
    this.messsageService.confirm('Are you sure to delete the selected groups?').subscribe(ok => {
      if (ok) {
        let deletes: Observable<any>[] = [];
        for (let g of this.selection.selected) {
          deletes.push(this.api.deleteNodeGroup(g.Name));
        }
        oneAfterAnother(deletes, 3);
        let deleteSet = new Set<NodeGroup>(this.selection.selected);
        let newGroups = this.dataSource.data.filter(e => !deleteSet.has(e));
        this.dataSource.data = newGroups;
        this.selection.clear();
      }
    });
  }

  get canEdit(): boolean {
    let selected = this.selection.selected;
    return selected.length == 1 && !selected[0].Managed;
  }

  get canDelete(): boolean {
    let selected = this.selection.selected;
    if (selected.length < 1) {
      return false;
    }
    for (let item of selected) {
      if (item.Managed) {
        return false;
      }
    }
    return true;
  }

  get anySelected(): boolean {
    return this.selection.selected.length > 0;
  }

  get allSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  get masterChecked(): boolean {
    return this.selection.hasValue() && this.allSelected;
  }

  get masterIndeterminate(): boolean {
    return this.selection.hasValue() && !this.allSelected;
  }

  masterToggle() {
    this.allSelected ?
      this.selection.clear() :
      this.dataSource.data.forEach(node => this.selection.select(node));
  }

  private get actionListHidden(): boolean {
    return this.userOptions.hideActionList !== undefined ? this.userOptions.hideActionList :
      (this.mediaQuery.smallWidth ? true: false);
  }

  private set actionListHidden(val: boolean) {
    this.userOptions.hideActionList = val;
    this.userService.saveUserOptions();
  }

  get isActionListHidden(): boolean {
    return this.actionListHidden;
  }

  toggleActionList(): void {
    this.actionListHidden = !this.actionListHidden;
    setTimeout(() => this.sidenavContainer.updateContentMargins(), 0);
  }

  get toggleActionListIcon(): string {
    return this.actionListHidden ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
  }

  get adminView(): boolean {
    return this.userService.user.isAdmin;
  }

  linkToGroupNodes(group: NodeGroup): string[] {
    return ['.', group.Name];
  }
}
