import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', async () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  //first instance of task
  fireEvent.change(inputTask, {target : { value : 'duplicate'}});
  console.log(inputTask.value)
  fireEvent.change(inputDate, {target : { value : '06/20/2024'}});
  console.log(inputDate.value)
  fireEvent.click(element);

  //check that the item is added in the first place
  let tasks = screen.getAllByText('duplicate');
  expect(tasks.length).toBe(1);

  //add duplicate task with same date
  fireEvent.change(inputTask, {target : { value : 'duplicate'}});
  fireEvent.change(inputDate, {target : { value: '06/20/2024'}});

  fireEvent.click(element);

  //add duplicate task with different date
  fireEvent.change(inputTask, { target : { value : 'duplicate'}});
  fireEvent.change(inputDate, {target : { value: '03/20/2025'}});
  fireEvent.click(element);

  tasks = screen.getAllByText("duplicate");
  expect(tasks.length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  //trying to add a task without a task name or date
  fireEvent.click(element);

  expect(screen.queryByText('task')).not.toBeInTheDocument();

  //trying to add a task without a task name but with a date
  fireEvent.change(inputDate, {target : { value : '06/20/2024'}});
  fireEvent.click(element);

  expect(screen.queryByText('task')).not.toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  //trying to add a task with a task name but wihout a date
  fireEvent.change(inputTask, {target : { value : 'task'}});
  fireEvent.click(element);

  expect(screen.queryByText('task')).not.toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  //adding multiple elements
  fireEvent.change(inputTask, {target : { value : 'task1'}});
  fireEvent.change(inputDate, {target : { value : '06/20/2024'}});
  fireEvent.click(element);

  fireEvent.change(inputTask, {target : { value : 'task2'}});
  fireEvent.change(inputDate, {target : { value : '06/20/2024'}});
  fireEvent.click(element);

  fireEvent.change(inputTask, {target : { value : 'task3'}});
  fireEvent.change(inputDate, {target : { value : '06/20/2024'}});
  fireEvent.click(element);

  expect(screen.getByText('task1')).toBeVisible();
  expect(screen.getByText('task2')).toBeVisible();
  expect(screen.getByText('task3')).toBeVisible();

  //removing task2
  const task2Checkbox = screen.getByTestId("checkbox-task2");
  fireEvent.click(task2Checkbox);

  expect(screen.queryByText('task2')).not.toBeInTheDocument();
  expect(screen.getByText('task1')).toBeVisible();
  expect(screen.getByText('task3')).toBeVisible();

  //uncheck all
  const task1Checkbox = screen.getByTestId("checkbox-task1");
  const task3Checkbox = screen.getByTestId("checkbox-task3");

  fireEvent.click(task1Checkbox);
  fireEvent.click(task3Checkbox);

  expect(screen.queryByText('task1')).not.toBeInTheDocument();
  expect(screen.queryByText('task3')).not.toBeInTheDocument();
  expect(screen.getByText("You have no todo's left")).toBeVisible();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  //adding multiple elements
  //past due date
  fireEvent.change(inputTask, {target : { value : 'task1'}});
  fireEvent.change(inputDate, {target : { value : '06/20/2024'}});
  fireEvent.click(element);

  //future due date
  fireEvent.change(inputTask, {target : { value : 'task2'}});
  fireEvent.change(inputDate, {target : { value : '06/25/2026'}});
  fireEvent.click(element);

  const task1Check = screen.getByTestId('task1').style.background;
  const task2Check = screen.getByTestId('task2').style.background;

  expect(task1Check).toBe('rgb(255, 105, 97)');
  expect(task2Check).toBe('rgb(255, 255, 255)');
 });
