<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210712_book_attachment extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%book_attachment}}',
            [
                'id'=> $this->primaryKey(11),
                'book_id'=> $this->integer(11)->notNull(),
                'path'=> $this->string(255)->notNull(),
                'base_url'=> $this->string(255)->null()->defaultValue(null),
                'type'=> $this->string(255)->null()->defaultValue(null),
                'size'=> $this->integer(11)->null()->defaultValue(null),
                'name'=> $this->string(255)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'order'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('fk_book_attachment_book','{{%book_attachment}}','book_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_book_attachment_book', '{{%book_attachment}}');
        $this->dropTable('{{%book_attachment}}');
    }
}
