import * as React from "react";
import { useState } from "react";

import Atoms, { TNoteState } from "./Atoms";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Paragraph,
  Text,
  TextArea,
  TextInput
} from "grommet";

import { Trash, Edit, Save, Search } from "grommet-icons";
import { useRecoilState } from "recoil";
import "./animations.css";

const { noteStoreAtom } = Atoms;

type TNoteCardItemProps = TNoteState;

function replaceItemAtIndex<T>(
  arr: Array<T>,
  index: number,
  newValue: T
): Array<T> {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex<T>(arr: Array<T>, index: number): Array<T> {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

const NoteCardItem = ({ title, content, id }: TNoteCardItemProps) => {
  const [isLiveEdit, setIsLiveEdit] = useState<boolean>(false);
  const [liveContent, setLiveContent] = useState<string>(content);
  const [liveTitle, setLiveTitle] = useState<string>(title);
  const [noteStore, setNoteStore] = useRecoilState(noteStoreAtom);

  const index = noteStore.findIndex((node) => node.id === id);

  const edit = () => {
    const newList = replaceItemAtIndex(noteStore, index, {
      id: id,
      content: liveContent,
      title: liveTitle
    });
    setNoteStore(newList);
  };

  const deleteNote = () => {
    const newList = removeItemAtIndex(noteStore, index);
    setNoteStore(newList);
  };

  function editHandler() {
    if (isLiveEdit) {
      edit();
      setIsLiveEdit(false);
      return;
    }
    setIsLiveEdit(true);
  }

  if (isLiveEdit) {
    return (
      <Card className="fade-in" pad="large">
        <CardHeader>
          <TextInput
            value={liveTitle}
            onChange={(event) => setLiveTitle(event.target.value)}
          />
        </CardHeader>
        <br />
        <CardBody>
          <TextArea
            rows={8}
            value={liveContent}
            onChange={(event) => setLiveContent(event.target.value)}
          />
        </CardBody>
        <CardFooter justify="end" pad={{ top: "small" }}>
          <Button
            onClick={editHandler}
            icon={<Save />}
            label="Save Changes"
            hoverIndicator
          />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className="fade-in"
      pad="large"
      margin={{
        top: "large"
      }}
    >
      <CardHeader>
        <Heading>{title}</Heading>
      </CardHeader>
      <CardBody>
        <Paragraph fill>{content}</Paragraph>
      </CardBody>
      <CardFooter justify="end" pad={{ top: "small" }}>
        <Button
          onClick={editHandler}
          icon={<Edit />}
          label="Edit"
          hoverIndicator
        />
        <Button
          onClick={deleteNote}
          icon={<Trash />}
          label="Delete"
          hoverIndicator
        />
      </CardFooter>
    </Card>
  );
};

type TNoteCardsProps = Readonly<{
  items: ReadonlyArray<TNoteState>;
}>;

const NoteCards = ({ items }: TNoteCardsProps) => {
  if (items.length <= 0) {
    return <Text>There are no notes at the moment...</Text>;
  }
  return (
    <>
      {items.map(({ id, title, content }) => (
        <NoteCardItem key={id} id={id} title={title} content={content} />
      ))}
    </>
  );
};
export default function App() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [noteStore, setNoteStore] = useRecoilState(noteStoreAtom);
  const [search, setSearch] = useState<string>("");

  const filterSearchOptions = (word: string) => {
    return noteStore.filter((node) =>
      node.title.toLowerCase().includes(word.toLowerCase())
    );
  };

  const addItem = (title: string, content: string) => {
    setNoteStore((oldNoteStore) => [
      ...oldNoteStore,
      {
        id:
          oldNoteStore.length <= 0
            ? 1
            : oldNoteStore[oldNoteStore.length - 1].id + 1,
        content,
        title
      }
    ]);
  };

  function handleNoteSubmission() {
    addItem(title, content);
    setTitle("");
    setContent("");
  }

  return (
    <Box pad="large">
      <TextInput
        placeholder="Search"
        value={search}
        icon={<Search />}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Heading>Notes Manager App</Heading>
      <TextInput
        placeholder="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <br />
      <TextArea
        placeholder="content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <br />
      <Button
        primary
        label={noteStore.length <= 0 ? "Add Your First Note!" : "Add Note"}
        onClick={handleNoteSubmission}
      />
      <br />
      <NoteCards items={filterSearchOptions(search)} />
    </Box>
  );
}
