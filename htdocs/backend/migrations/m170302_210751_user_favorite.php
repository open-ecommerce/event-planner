<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210751_user_favorite extends Migration
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
            '{{%user_favorite}}',
            [
                'id'=> $this->primaryKey(11)->unsigned(),
                'user_id'=> $this->integer(11)->notNull(),
                'book_id'=> $this->integer(11)->notNull(),
                'selectedTime'=> $this->timestamp()->null()->defaultExpression("CURRENT_TIMESTAMP"),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%user_favorite}}');
    }
}
