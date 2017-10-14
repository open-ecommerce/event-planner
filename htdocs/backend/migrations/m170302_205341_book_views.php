<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205341_book_views extends Migration
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
            '{{%book_views}}',
            [
                'id'=> $this->primaryKey(11),
                'user_id'=> $this->integer(11)->null()->defaultValue(null),
                'book_id'=> $this->integer(11)->null()->defaultValue(null),
                'frequency'=> $this->integer(11)->null()->defaultValue(0),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('user_id','{{%book_views}}','user_id',false);
        $this->createIndex('book_id','{{%book_views}}','book_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('user_id', '{{%book_views}}');
        $this->dropIndex('book_id', '{{%book_views}}');
        $this->dropTable('{{%book_views}}');
    }
}
