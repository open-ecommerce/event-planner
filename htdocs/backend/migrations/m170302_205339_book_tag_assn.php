<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205339_book_tag_assn extends Migration
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
            '{{%book_tag_assn}}',
            [
                'book_id'=> $this->integer(11)->null()->defaultValue(null),
                'tag_id'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%book_tag_assn}}');
    }
}
